import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useGamification } from './GamificationContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const { awardXP } = useGamification();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTag, setActiveTag] = useState('all');
    const [activeFilter, setActiveFilter] = useState('all');

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
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

        const subscription = supabase
            .channel('tasks_channel_v2')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tasks',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTasks((prev) => [payload.new, ...prev]);
                } else if (payload.eventType === 'DELETE') {
                    setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setTasks((prev) => prev.map((t) => (t.id === payload.new.id ? payload.new : t)));
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(subscription); };
    }, [user, fetchTasks]);

    const addTask = async ({ title, description = '', tags = [], deadline = null, priority = 'medium' }) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ title, description, tags, deadline, priority, user_id: user.id }])
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
        const result = await updateTask(id, { completed: !currentStatus });
        if (!result.error && !currentStatus) {
            // Task was just completed → award XP
            awardXP(25);
        }
        return result;
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

    // Derived filtered list
    const filteredTasks = tasks.filter((task) => {
        const tagMatch = activeTag === 'all' || (task.tags && task.tags.includes(activeTag));
        const statusMatch =
            activeFilter === 'all' ? true :
                activeFilter === 'pending' ? !task.completed :
                    activeFilter === 'completed' ? task.completed : true;
        return tagMatch && statusMatch;
    });

    const value = {
        tasks,
        filteredTasks,
        loading,
        error,
        activeTag,
        setActiveTag,
        activeFilter,
        setActiveFilter,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        refreshTasks: fetchTasks,
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};
