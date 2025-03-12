import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface CalendarProps {
    onChange: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onChange }) => {
    return (
        <div className="iphone-calendar-container">
            <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                popupClassName="iphone-calendar-popup"
                showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                style={{ width: '100%' }}
                onChange={(date) => onChange(date ? date.toDate() : null)}
            />
        </div>
    );
};

export default Calendar;