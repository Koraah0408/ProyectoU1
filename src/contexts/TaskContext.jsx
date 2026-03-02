import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();

        if (!user) {
            setTasks([]);
            return;
        }

        // Subscribe to realtime changes
        const subscription = supabase
            .channel('tasks_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTasks((prev) => [payload.new, ...prev]);
                } else if (payload.eventType === 'DELETE') {
                    setTasks((prev) => prev.filter((task) => task.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setTasks((prev) => prev.map((task) => (task.id === payload.new.id ? payload.new : task)));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, fetchTasks]);

    const addTask = async (title, description) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ title, description, user_id: user.id }])
                .select();
            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err.message };
        }
    };

    const updateTask = async (id, updates) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            return { error: null };
        } catch (err) {
            return { error: err.message };
        }
    };

    const toggleTaskComplete = async (id, currentStatus) => {
        return updateTask(id, { completed: !currentStatus });
    };

    const deleteTask = async (id) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);
            if (error) throw error;
            return { error: null };
        } catch (err) {
            return { error: err.message };
        }
    };

    const value = {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        refreshTasks: fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};
