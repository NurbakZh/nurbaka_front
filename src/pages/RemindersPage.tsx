import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Collapse } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '../shared/components/NavBar/NavBar';
import { useThemeStore } from '../shared/stores/theme';
import { NotificationStatus, NotificationType } from '../shared/types/types';

const remindersData = [
  { 
    id: uuidv4(),
    userId: "user123",
    dealId: "deal123",
    clientId: "client123",
    message: "Обсудить условия сделки",
    reminderTime: new Date("2024-03-20T14:00:00"),
    type: NotificationType.REMINDER,
    status: NotificationStatus.ACTIVE,
    createdAt: new Date(),
    title: "Позвонить клиенту"
  },
  { 
    id: uuidv4(),
    userId: "user123",
    dealId: "deal124",
    clientId: "client124",
    message: "Финальный отчет по оплате",
    reminderTime: new Date("2024-03-20T16:30:00"),
    type: NotificationType.REMINDER,
    status: NotificationStatus.ACTIVE,
    createdAt: new Date(),
    title: "Отправить отчет"
  },
  { 
    id: uuidv4(),
    userId: "user123",
    dealId: "deal124",
    clientId: "client124",
    message: "Финальный отчет по оплате",
    reminderTime: new Date("2024-03-21T16:30:00"),
    type: NotificationType.REMINDER,
    status: NotificationStatus.ACTIVE,
    createdAt: new Date(),
    title: "Отправить отчет"
  }
];

const RemindersPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const theme = useThemeStore((x) => x.theme);

  // Group reminders by date
  const groupedReminders = remindersData.reduce((acc, reminder) => {
    const date = dayjs(reminder.reminderTime).format('DD.MM.YYYY');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reminder);
    return acc;
  }, {} as Record<string, typeof remindersData>);

  return (
    <div className={`page ${theme}`} style={{ overflowY: 'scroll', paddingBottom: '0px' }}>
      <div className='container'>
        <h3>Напоминания: </h3>

        {/* Calendar */}
        {/* <Card className={`${theme}`} style={{
          padding: '12px',
          backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)',
          border: 'none',
          borderRadius: '12px',
          marginBottom: '16px',
          boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
        }}>
          <Calendar 
            className={`date-picker ${theme}`} 
            value={selectedDate} 
            onChange={(date) => setSelectedDate(date)}
          />
        </Card> */}

        {/* Add Reminder Button */}
        <Button 
          block 
          type="primary" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: 'var(--accent-blue)',
            fontSize: '16px', 
            height: '40px' 
          }}>
          <PlusOutlined />
          Добавить напоминание
        </Button>

        {/* Reminders List Grouped by Date */}
        {Object.entries(groupedReminders).map(([date, reminders]) => (
          <div key={date}>
            <h2 className={`date-header ${theme}`} style={{ 
              margin: '24px 0 16px 0',
              textAlign: 'start',
              fontSize: '1.2em',
              fontWeight: 'bold' 
            }}>
              {dayjs(date, 'DD.MM.YYYY').format('D MMMM').replace('January', 'Января').replace('February', 'Февраля').replace('March', 'Марта').replace('April', 'Апреля').replace('May', 'Мая').replace('June', 'Июня').replace('July', 'Июля').replace('August', 'Августа').replace('September', 'Сентября').replace('October', 'Октября').replace('November', 'Ноября').replace('December', 'Декабря')}
            </h2>
            
            {reminders.map((reminder) => (
              <Card className={`${theme}`} key={reminder.id} style={{
                padding: '20px',
                backgroundColor: theme === 'light' ? 'var(--card-light)' : 'var(--card-dark)',
                border: 'none',
                borderRadius: '12px',
                marginBottom: '16px',
                boxShadow: theme === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : '0px 4px 10px rgba(255, 255, 255, 0.1)',
              }}>
                <h3 className={`input-label ${theme}`} style={{ margin: 0 }}>
                  {reminder.title} - {dayjs(reminder.reminderTime).format('HH:mm')}
                </h3>
                <p className={`input-label ${theme}`} style={{ opacity: 0.7, margin: '8px 0' }}>
                  {reminder.message}
                </p>
                
                <Collapse 
                  ghost 
                  className={`collapse ${theme} header-notification`}
                  items={[
                    {
                      key: '1',
                      label: (
                        <span style={{ 
                          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                          fontSize: '14px',
                          padding: '0px'
                        }}>
                          Подробнее
                        </span>
                      ),
                      children: (
                        <div className={`details ${theme}`} style={{
                          color: theme === 'light' ? 'var(--text-light)' : 'var(--text-dark)',
                          fontSize: '14px',
                          textAlign: 'start',
                          paddingLeft: '12px',
                          padding: '0px'
                        }}>
                          <p>Статус: {reminder.status}</p>
                          <p>Тип: {reminder.type}</p>
                          <p>Создано: {dayjs(reminder.createdAt).format('DD.MM.YYYY HH:mm')}</p>
                          <p>
                            Клиент: <Link to={`/clients/${reminder.clientId}`} style={{
                              color: 'var(--accent-blue)',
                              textDecoration: 'none'
                            }}>{reminder.clientId}</Link>
                          </p>
                          <p>
                            Сделка: <Link to={`/deals/${reminder.dealId}`} style={{
                              color: 'var(--accent-blue)',
                              textDecoration: 'none'
                            }}>{reminder.dealId}</Link>
                          </p>
                        </div>
                      ),
                    },
                  ]}
                  style={{
                    background: 'transparent',
                    marginTop: '8px',
                    padding: '0px'
                  }}
                />
              </Card>
            ))}
          </div>
        ))}
      </div>
      <NavBar />
    </div>
  );
}

export default RemindersPage;
