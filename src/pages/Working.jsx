import React from 'react';
import { Card, Typography, Steps, Divider, List, Collapse, Space, Button, Tag } from 'antd';
import { CodeOutlined, CheckCircleOutlined, FileTextOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const Working = () => {
  const navigate = useNavigate();

  // 10 ta dasturlash tili va ularning tushuntirishlari
  const supportedLanguages = [
    {
      name: 'Python',
      version: '3.x',
      description: 'Python - bu oson o‘rganiladigan va ko‘p qirrali dasturlash tili bo‘lib, musobaqa dasturlashda keng qo‘llaniladi.',
      example: `print("Salom, Dunyo!")`,
      usage: 'Python-da standart kiritish (stdin) uchun input() funksiyasidan, chiqish (stdout) uchun print() funksiyasidan foydalaning.',
    },
    {
      name: 'C++',
      version: 'C++17',
      description: 'C++ yuqori samaradorlikka ega va musobaqa dasturlashda tezlik uchun afzal ko‘riladi.',
      example: `#include <iostream>
using namespace std;
int main() {
    cout << "Salom, Dunyo!" << endl;
    return 0;
}`,
      usage: 'C++ da kiritish uchun cin, chiqish uchun cout ishlatiladi. Tezlik uchun ios_base::sync_with_stdio(false) qo‘shing.',
    },
    {
      name: 'Java',
      version: '17',
      description: 'Java - obyektga yo‘naltirilgan dasturlash tili bo‘lib, keng ko‘lamli ilovalar uchun ishlatiladi.',
      example: `public class Main {
    public static void main(String[] args) {
        System.out.println("Salom, Dunyo!");
    }
}`,
      usage: 'Java-da kiritish uchun Scanner sinfi, chiqish uchun System.out.println ishlatiladi.',
    },
    {
      name: 'JavaScript',
      version: 'ES6+',
      description: 'JavaScript asosan veb-dasturlash uchun ishlatiladi, lekin Node.js yordamida musobaqa dasturlashda ham qo‘llaniladi.',
      example: `console.log("Salom, Dunyo!");`,
      usage: 'Node.js da kiritish uchun process.stdin, chiqish uchun console.log ishlatiladi.',
    },
    {
      name: 'C#',
      version: '.NET 6',
      description: 'C# - Microsoft tomonidan ishlab chiqilgan zamonaviy dasturlash tili.',
      example: `using System;
class Program {
    static void Main() {
        Console.WriteLine("Salom, Dunyo!");
    }
}`,
      usage: 'C# da kiritish uchun Console.ReadLine, chiqish uchun Console.WriteLine ishlatiladi.',
    },
    {
      name: 'Ruby',
      version: '3.x',
      description: 'Ruby - oddiy sintaksisga ega va foydalanuvchi uchun qulay dasturlash tili.',
      example: `puts "Salom, Dunyo!"`,
      usage: 'Ruby da kiritish uchun gets, chiqish uchun puts ishlatiladi.',
    },
    {
      name: 'Go',
      version: '1.x',
      description: 'Go - Google tomonidan ishlab chiqilgan samarali va soddaligi bilan ajralib turadi.',
      example: `package main
import "fmt"
func main() {
    fmt.Println("Salom, Dunyo!")
}`,
      usage: 'Go da kiritish uchun fmt.Scan, chiqish uchun fmt.Println ishlatiladi.',
    },
    {
      name: 'Kotlin',
      version: '1.x',
      description: 'Kotlin - Android dasturlash va umumiy ilovalar uchun mashhur dasturlash tili.',
      example: `fun main() {
    println("Salom, Dunyo!")
}`,
      usage: 'Kotlin da kiritish uchun readLine(), chiqish uchun println ishlatiladi.',
    },
    {
      name: 'Swift',
      version: '5.x',
      description: 'Swift - Apple platformalari uchun mo‘ljallangan kuchli va tezkor dasturlash tili.',
      example: `print("Salom, Dunyo!")`,
      usage: 'Swift da kiritish uchun readLine(), chiqish uchun print ishlatiladi.',
    },
    {
      name: 'PHP',
      version: '8.x',
      description: 'PHP - veb-dasturlashda keng qo‘llaniladigan skript tili.',
      example: `<?php
echo "Salom, Dunyo!";
?>`,
      usage: 'PHP da kiritish uchun fgets(STDIN), chiqish uchun echo ishlatiladi.',
    },
  ];

  // Tizimdan foydalanish bosqichlari
  const steps = [
    {
      title: 'Ro‘yxatdan o‘tish/Kirish',
      description: 'Hisob yarating yoki tizimga kiring, masalalar va yechimlarni yuborish uchun.',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Masala tanlash',
      description: 'Mavjud masalalarni ko‘rib chiqing yoki olimpiadada qatnashing.',
      icon: <CodeOutlined />,
    },
    {
      title: 'Kod yozish va yuborish',
      description: 'Kod muharririda yechim yozing va uni yuboring.',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Natijalarni ko‘rish',
      description: 'Yuborilgan yechim natijalarini, test holatlari va ish vaqtini ko‘ring.',
      icon: <RocketOutlined />,
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Tizimdan Qanday Foydalanish Mumkin?</Title>
      <Paragraph>
        Bizning Onlayn Yechim Tekshirish platformamizga xush kelibsiz! Ushbu qo‘llanma sizga tizimdan qanday foydalanish, dasturlash masalalarini yechish va olimpiadalarda qatnashish bo‘yicha yo‘l ko‘rsatadi.
      </Paragraph>

      <Divider orientation="left">Boshlash Uchun Bosqichlar</Divider>
      <Card>
        <Steps direction="vertical" current={-1}>
          {steps.map((step) => (
            <Step
              key={step.title}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </Steps>
      </Card>

      <Divider orientation="left">Yechimlarni Yuborish</Divider>
      <Card>
        <Paragraph>
          Yechim yuborish uchun quyidagi bosqichlarni bajaring:
        </Paragraph>
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              title: 'Masala tanlash',
              description: 'Masalalar sahifasiga o‘ting yoki olimpiada bo‘limidan masalani tanlang.',
            },
            {
              title: 'Kod yozish',
              description: 'O‘rnatilgan kod muharririda yechimingizni yozing. Kod standart kiritish (stdin) dan o‘qishi va standart chiqishga (stdout) yozishi kerak.',
            },
            {
              title: 'Dasturlash tilini tanlash',
              description: 'Yechimingiz uchun dasturlash tilini tanlang. Hozirda faqat Python qo‘llab-quvvatlanadi.',
            },
            {
              title: 'Yuborish',
              description: '"Yuborish" tugmasini bosing, kod serverga yuboriladi va oldindan belgilangan test holatlari bo‘yicha baholanadi.',
            },
            {
              title: 'Natijalarni ko‘rish',
              description: 'Yuborishdan so‘ng natijalarni ko‘ring: yechim qabul qilinganmi, ish vaqti va har bir test holati haqida ma’lumot.',
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Card>

      <Divider orientation="left">Qo‘llab-quvvatlanadigan Dasturlash Tillari</Divider>
      <Card>
        <Paragraph>
          Platformamiz quyidagi dasturlash tillarini qo‘llab-quvvatlaydi. Har bir til haqida ko‘proq ma’lumot olish uchun uning nomiga bosing. Kelajakda boshqa tillar qo‘shilishi mumkin.
        </Paragraph>
        <Collapse accordion>
          {supportedLanguages.map((lang) => (
            <Panel
              header={
                <Space>
                  <span>{lang.name}</span>
                  <Tag>{lang.version}</Tag>
                </Space>
              }
              key={lang.name}
            >
              <Paragraph>{lang.description}</Paragraph>
              <Paragraph>
                <strong>Foydalanish bo‘yicha maslahat:</strong> {lang.usage}
              </Paragraph>
              <Paragraph>
                <strong>Misol kod:</strong>
              </Paragraph>
              <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                {lang.example}
              </pre>
            </Panel>
          ))}
        </Collapse>
      </Card>

      <Divider orientation="left">Kiritish/Chiqish Bo‘yicha Yo‘riqnoma</Divider>
      <Card>
        <Paragraph>
          Kodingizni yozishda kiritish va chiqishni to‘g‘ri boshqarishga e’tibor bering:
        </Paragraph>
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              title: 'Kiritish',
              description: 'Standart kiritish (stdin) dan ma’lumot o‘qing. Masalan, Python-da input() yoki sys.stdin ishlatiladi.',
            },
            {
              title: 'Chiqish',
              description: 'Standart chiqishga (stdout) ma’lumot yozing. Masalan, Python-da print() yoki sys.stdout ishlatiladi.',
            },
            {
              title: 'Formatlash',
              description: 'Chiqish formati (bo‘shliqlar, yangi qatorlar) aniq kutilgan natijaga mos bo‘lishi kerak.',
            },
            {
              title: 'Cheklovlar',
              description: 'Masalaning vaqt cheklovi (masalan, 2 soniya) va xotira cheklovini (masalan, 256 MB) hisobga oling.',
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Card>

      <Divider orientation="left">Boshlashga Tayyormisiz?</Divider>
      <Space>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/problems')}
        >
          Masalalarni Ko‘rish
        </Button>
        <Button
          size="large"
          onClick={() => navigate('/olympiads')}
        >
          Olimpiadaga Qo‘shilish
        </Button>
      </Space>
    </div>
  );
};

export default Working;