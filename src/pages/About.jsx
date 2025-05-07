import React from 'react';
import { Card } from 'antd';
import '../styles/about.css'; // We'll create this CSS file
import M from '../assets/mns.jpg';
import Sh from '../assets/shrb.webp';
import ZSM from '../assets/zsm.jpg';

// Sample team data
const teamMembers = [
  {
    name: "Abdullayev Munis Kurbonovich",
    image: M,
    description: "Toshkent davlat iqtisodiyot universiteti “Raqamli iqtisodiyot va axborot texnologiyalari” kafedrasi mudiri lavozimida faoliyat yuritgan. Moskva davlat universiteti qoshidagi Moskva iqtisodiyot maktabi, Ural davlat iqtisodiyot universitetida malaka oshirgan hamda Aleksandr I nomidagi Sankt Peterburg davlat transport universitetida stajirovka o‘tagan. Shuningdek, “Iqtisodiyot va innovatsion texnologiyalar” hamda “Raqamli iqtisodiyot va axborot texnologiyalari” elektron ilmiy jurnallari Bosh muharriri hisoblanadi. 60 dan ortiq ilmiy maqola va ilmiy-uslubiy ishlar, jumladan 2 ta darslik, 6 ta oʻquv qoʻllanma, 3 ta oʻquv-uslubiy qoʻllanma, 1 ta monografiya muallifi hisoblanadi. “Raqamli iqtisodiyot”, “Iqtisodiy axborotni qayta ishlashning instrumental vositalari”, “Kompyuter arxitekturasi”, “Biznes intellekti”, “Ma’lumotlar bazalari” kabi darslik va o‘quv qo‘llanmalaridan talabalar keng foydalanmoqda. U o‘z faoliyati davomida bir qancha axborot tizimlarini loyihalashtirib, mobil ilovalarni ishlab chiqgan va ta’lim tizimiga samarali tatbiq etgan.",
    position: "PhD , DOTSENT, Project manager"
  },
  {
    name: "Rajabov Sherzod Baxtiyorovich",
    image: Sh,
    description: "2024-yildan boshlab Xalqaro Nordik Universiteti “Sanoatni boshqarish va raqamli texnologiyalar” kafedrasida dotsent lavozimida ishlab kelmoqda. C++, HTML, CSS, Power BI, Tableau, PostgreSQL, kabi dasturlash tillari hamda dasturlari bilan ishlay oladi. 30 dan ortiq ilmiy maqola va ilmiy-uslubiy ishlar, jumladan 1 ta darslik, 7 ta oʻquv qoʻllanma, 1 ta monografiya muallifi hisoblanadi. “Operatsion Systems”, “IResearch methods and skills”, “Kompyuter arxitekturasi”, “Biznes intellekti”, “Elektron hukumat”, kabi darslik va o‘quv qo‘llanmalaridan talabalar keng foydalanib kelishmoqda. Xalqalaro ilmiy bazlarda shuningdek Scopus, Web of science, 10 ta maqolasi chop qilingan.",
    position: "DOTSENT, DASTURCHI MUHANDIS"
  },
  {
    name: "Sodiqov Ziyodulla Mehriddin o'g'li",
    image: ZSM,
    description: "2023-yildan boshlab Xalqaro Nordik Universiteti kompyuter injenering  KI-23 gruh talabasi. HTML, CSS, Sass, Bootstrap,  JavaScript, Php, Laravel, Yii2 , Mysql, NodeJs, ReactJs kabi dasturlash tillarni  biladi. ",
    position: "Founder"
  }
];

const About = () => {
  return (
    <div className="team-section">
      <h2 className="section-title">Jamoamiz Haqida</h2>
      <div className="team-cards-container">
        {teamMembers.map((member, index) => (
          <div className="card-wrapper" key={index}>
            <Card className="team-card">
              <div className="card-content">
                <div className="image-container">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-image"
                  />
                </div>
                <div className="text-container">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-position">{member.position}</p>
                  <p className="member-description">{member.description}</p>
                  <div className="divider"></div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;