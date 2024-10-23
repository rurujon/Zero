import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "./Card.css"

const OrgApp = () => {
    const [orgList, setOrgList] = useState([]);
    const [globalOrgList, setGlobalOrgList] = useState([]);

    const fetchOrgData = async () => {
        try {
            const response = await axios.get('/api/org/list');
            setOrgList(response.data);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };

    const fetchGlobalOrgData = async () => {
        try {
            const response = await axios.get('/api/org/globalList');
            setGlobalOrgList(response.data);
        } catch (error) {
            console.error("Error fetching organization data:", error);
        }
    };

    const handleCrawl = async () => {
        try {
            await axios.post('/api/org/crawl');
            alert("크롤링이 완료되었습니다.");
            fetchOrgData();  // 갱신된 데이터를 가져옵니다.
        } catch (error) {
            console.error("Error during crawling:", error);
            alert("크롤링 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchOrgData();
        fetchGlobalOrgData();
    }, []);



    return (

        
        <section className='list'>
            <div className="list_container">

                <h2 className='title'>국제 환경 보호 단체</h2>
                <ul className="card">
                    {globalOrgList.map((globalOrg, index) => (
                        <li key={index} className="card_list">
                            <div className="card-bg">
                                {globalOrg.imgUrl && (
                                    <img src={globalOrg.imgUrl} alt={globalOrg.name}/>
                                )}
                            </div>
                            <div className='card_container'>
                                <div className='card_content'>
                                    <h2 className='card_content-name'>{globalOrg.name}</h2>
                                    <p className='card_content-description'>{globalOrg.description}</p>
                                </div>
                                <a href={globalOrg.link} className='card-btn'>홈페이지</a>
                            </div>
                        </li>
                    ))}
                </ul>

                
                <h2 className='title'>민간 환경 보호 단체</h2>
                <ul className="card">
                    {orgList.map((org, index) => (
                        <li key={index} className="card_list">
                            <div className="card-bg">
                                {org.imgUrl && (
                                    <img src={org.imgUrl} alt={org.name}/>
                                )}
                            </div>
                            <div className='card_container'>
                                <div className='card_content'>
                                    <h2 className='card_content-name'>{org.name}</h2>
                                    <p className='card_content-description'>{org.description}</p>
                                    <p className='card_content-location'>Location: {org.location}</p>
                                </div>
                                <a href='' className='card-btn'>기부하기</a>
                                <a href='' className='card-btn'>홈페이지</a>
                            </div>
                        </li>
                    ))}
                </ul>
                
            </div>
        </section>
    );
};

export default OrgApp;