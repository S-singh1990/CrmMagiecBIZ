import React, { useEffect, useState } from 'react';
import { View, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import axios from 'axios';
import { Calendar } from 'react-native-big-calendar';
import { PROCESS_KEY } from "@env";

const ScheduleEvent = () => {
    const [data, setData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM YYYY'));
    const [calendarKey, setCalendarKey] = useState(Date.now()); // Unique key for Calendar component

    useEffect(() => {
        const getCalendarData = async () => {
            try {
                const response = await axios.get(`${PROCESS_KEY}/get_calander_data`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        month: currentMonth // Send current month as a parameter
                    }
                });
                setData(response?.data?.lead);
            } catch (error) {
                console.error("Axios error:", error);
            }
        };
        getCalendarData();
    }, [currentMonth]);

    // Move other component logic outside of useEffect

    const events = data.map((lead) => ({
        title: `${lead.massage_of_calander}`,
        start: new Date(lead.followup_date), // Convert to Date object
        end: new Date(lead.followup_date) // Convert to Date object
    }));

    const handleVisibleDateChange = (visibleDates) => {
        const startDate = moment(visibleDates[0]).startOf('month');
        setCurrentMonth(startDate.format('MMMM YYYY'));
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(moment(currentMonth, 'MMMM YYYY').subtract(1, 'months').format('MMMM YYYY'));
        setCalendarKey(Date.now()); // Update calendar key to force re-render
    };

    const goToNextMonth = () => {
        setCurrentMonth(moment(currentMonth, 'MMMM YYYY').add(1, 'months').format('MMMM YYYY'));
        setCalendarKey(Date.now()); // Update calendar key to force re-render
    };

    return (
        <View>
            <View style={styles.calendarTopRow}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                    <Ionicons name="chevron-back-outline" size={22} />
                </TouchableOpacity>
                <Text style={styles.calendarHead}>{currentMonth}</Text>
                <TouchableOpacity onPress={goToNextMonth}>
                    <Ionicons name="chevron-forward-outline" size={22} />
                </TouchableOpacity>
            </View>
            <Calendar
                events={events}
                height={280}
                mode="month"
                startAccessor="start"
                endAccessor="end"
                views={['month', 'agenda']}
                style={{ height: 350 }}
                onVisibleDateChange={handleVisibleDateChange}
                key={calendarKey} // Use calendarKey as the key prop
            />
        </View>
    );
};

export default ScheduleEvent;

const styles = StyleSheet.create({
    calendarTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    calendarHead: {
        fontSize: 16,
    },
});
