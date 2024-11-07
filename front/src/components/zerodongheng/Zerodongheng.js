import React from 'react';
import "./Maincss.css"
const Zerodongheng = () => {
    return (
        <div className="zero-waste-intro" >
          <h2 style={{textAlign:'center'}}>제로 동행(Zero together)</h2>

            <div className="highlight-box">
                <p style={{textAlign:'center', fontSize:'21px', padding:'auto'}}>
                    "제로웨이스트와 업사이클링 문화 확산으로
                    사용자의 노력에 가치를 더하다.""
                </p>
                <button class="btn btn-outline-dark" type="submit">발전을 위한 후원하기</button>
            </div>

            <hr/>

            <section>
                <div style={{display:'flex', flexDirection:'row', }}>
                    <fieldset style={{width:'70%'}}>
                        <legend>1. 포인트 제도와 참여 유도</legend>
                        <div>
                            <ui style={{fontSize:'20px'}}>
                                <li>
                                출석체크, 퀴즈 풀기, 커뮤니티 게시판 활동 등으로 사용자에게 친환경 활동 시 할인 혜택을 제공합니다.
                                </li>

                                <li>
                                온라인뿐만 아니라 실생활에서도 지속적인 참여를 유도할 수 있습니다.
                                </li>
                            </ui>
                        </div>
                    </fieldset>
                    <div >
                        <fieldset fieldset style={{width:'auto'}}>
                            <img src='/images/zerodonghaeng/change.png' style={{width:'99%', height:'99%', objectFit:'cover', borderRadius:'5px'}} alt='change'/>
                        </fieldset>
                    </div>

                </div>
                <fieldset>
                    <legend>2. 다양한 친환경 활동 정보 공유</legend>
                    <p>
                        정부, 기업, 개인 간의 친환경 활동 정보를 체계적으로 정리하고 통합하여 사용자에게 정보 접근성을 제공합니다.
                        제로동행은 참여와 접근성을 높여 지속 가능한 미래를 만들어가는 동행자입니다.
                    </p>
                </fieldset>
            </section>

            <hr />

            <div>

            </div>
        
        </div>
    );
};

export default Zerodongheng;