import React from 'react';
import './Maincss.css'

const Recycling = () => {
    return (
        <div className="recycling-container">
            <h2>리사이클링이란?</h2>
            <p>
                리사이클링은 사용된 물건을 새로운 제품으로 만드는 과정으로, 자원의 낭비를 줄이고 환경을 보호하는 중요한 방법입니다. <br/>
                많은 자원을 절약할 수 있으며, 쓰레기를 줄이는 데 기여할 수 있습니다.
            </p>

            <br/><br/>
            <hr/>
            <br/><br/>
            
            <div className="recycling-content">
                <div>
                    <img src='/images/zerodonghaeng/recy.png' alt='recycle' />
                </div>
                <div className="recycling-info">
                    <h3 className='left-align'>리사이클링의 필요성</h3>
                    <ul>
                        <li style={{fontSize:'16px'}}><strong>자원 절약:</strong> 원자재의 필요성을 줄여 자원을 보존합니다. 이를통해 원료추출과 가공에 필요한 에너지를 절약하는데 도움이 됩니다.</li>
                        <li style={{fontSize:'16px'}}><strong>환경 보호:</strong> 매립지와 소각장에서 발생하는 환경 오염을 감소시킵니다.</li>
                        <li style={{fontSize:'16px'}}><strong>에너지 절약:</strong> 원자재 추출 및 처리에 사용되는 에너지 집약적 공정의 필요성을 줄여 에너지를 절약합니다.</li>
                        <li style={{fontSize:'16px'}}><strong>폐기물 감소:</strong> 재활용은 매립지로 갈 수 있는 물질을 재사용함으로써 폐기물을 줄이는데 도움이 됩니다.</li>
                    </ul>
                </div>
            </div>

            <br/><br/>
            <hr/>
            <br/><br/>

            <div className="recycling-method">
                <h3>리사이클링 방법</h3>
                <p>
                    리사이클링을 실천하기 위해 가정에서 분리 배출을 철저히 하고, <br/>
                    재활용이 가능한 자원을 분류하여 올바르게 버리는 습관을 들이는 것이 중요합니다.
                </p>
            </div>
        </div>
    );
};

export default Recycling;
