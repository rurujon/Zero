import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendar.css';

const Calendar = ({ memId }) => {
    const [date, setDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(`/attendance/dates`, {
                params: { memId }
            });
            console.log('출석 데이터:', response.data);
            setAttendanceData(response.data.map(date => new Date(date)));
        } catch (error) {
            console.error('출석 데이터 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, [date, memId]);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
        const firstDay = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<td key={`empty-${i}`} className="empty"></td>);
        }

        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
            const isAttended = attendanceData.some(att =>
                att.getFullYear() === currentDate.getFullYear() &&
                att.getMonth() === currentDate.getMonth() &&
                att.getDate() === currentDate.getDate()
            );
            const isPast = currentDate < today;

            let className = 'day';
            if (isAttended) {
                className += ' attended';
            } else if (isPast) {
                className += ' not-attended';
            }

            days.push(
                <td key={day} className={className}>
                    {day}
                </td>
            );
        }

        return days;
    };

    const weeks = [];
    const days = renderCalendar();
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
    }

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h3>{date.getFullYear()}년 {date.getMonth() + 1}월</h3>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>일</th>
                        <th>월</th>
                        <th>화</th>
                        <th>수</th>
                        <th>목</th>
                        <th>금</th>
                        <th>토</th>
                    </tr>
                </thead>
                <tbody>{weeks}</tbody>
            </table>
            <div className="calendar-legend">
                <div className="legend-item">
                    <span className="legend-color attended"></span>
                    <span className="legend-text">출석</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color not-attended"></span>
                    <span className="legend-text">미출석</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
