import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './KanbanBoard.module.css';

const KanbanBoard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const apiUrl = 'http://localhost:3000/api/laws';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data.slice(0, 50));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const uniqueStatusIds = [...new Set(data.map((item) => item.statusid))];

  const sortedData = uniqueStatusIds.map((statusId) =>
    data.filter((item) => item.statusid === statusId)
  );

  return (
    <div className={styles.kanbanBoard}>
      <div className={styles.kanbanColumns}>
        {}
        {uniqueStatusIds.map((statusId, index) => (
          <div className={styles.kanbanColumn} key={index}>
            <h2 className={styles.kanbanColumnTitle}>Status: {statusId}</h2>
            {}
            {sortedData[index].map((item: any) => (
              <div className={styles.kanbanCard} key={item.id}>
                <h3 className={styles.kanbanCardTitle}>{item.titel}</h3>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
