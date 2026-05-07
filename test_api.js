const https = require('https');

const testCode = '600519';
const fsId = `1.${testCode}`;
const url = `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=f12,f14,f2,f3,f5,f6,f10&secids=${fsId}`;

console.log('测试API URL:', url);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('原始返回数据:');
            console.log(JSON.stringify(jsonData, null, 2));
            
            if (jsonData.data && jsonData.data.diff) {
                const stock = jsonData.data.diff[0];
                console.log('\n股票数据:');
                console.log('代码:', stock.f12);
                console.log('名称:', stock.f14);
                console.log('最新价(f2):', stock.f2);
                console.log('涨跌幅(f3):', stock.f3);
                console.log('成交量(f5):', stock.f5);
                console.log('成交额(f6):', stock.f6);
                
                console.log('\n计算后的价格:');
                console.log('price = f2 / 100 =', stock.f2 / 100);
                console.log('price_change_percent = f3 / 100 =', stock.f3 / 100);
            }
        } catch (error) {
            console.error('解析错误:', error);
        }
    });
}).on('error', (error) => {
    console.error('请求错误:', error);
});