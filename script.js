const apiKey = 'cqc3e1pr01qmbcu90jo0cqc3e1pr01qmbcu90jog';

const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' },
    { username: 'user3', password: 'pass3' },
    { username: 'user4', password: 'pass4' },
    { username: 'user5', password: 'pass5' },
    { username: 'user6', password: 'pass6' },
    { username: 'user7', password: 'pass7' },
    { username: 'user8', password: 'pass8' },
    { username: 'user9', password: 'pass9' },
    { username: 'user10', password: 'pass10' },
    { username: 'user11', password: 'pass11' },
    { username: 'user12', password: 'pass12' },
    { username: 'user13', password: 'pass13' },
    { username: 'user14', password: 'pass14' },
    { username: 'user15', password: 'pass15' },
    { username: 'user16', password: 'pass16' },
    { username: 'user17', password: 'pass17' },
    { username: 'user18', password: 'pass18' },
    { username: 'user19', password: 'pass19' },
    { username: 'user20', password: 'pass20' },
];

async function getStockData(symbol, interval) {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${interval}&from=${oneHourAgo}&to=${now}&token=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.s !== 'ok') {
            throw new Error('Dados inválidos da API');
        }

        return data.c; // Closing prices
    } catch (error) {
        console.error('Erro ao buscar dados da Finnhub:', error);
        return [];
    }
}

async function analyzeMarket(symbol, interval) {
    const data = await getStockData(symbol, interval);
    if (data.length === 0) {
        return 'Erro ao obter dados.';
    }

    const rsi = calculateRSI(data, 14);
    const lastRSI = rsi[rsi.length - 1];

    if (lastRSI < 30) {
        return 'Sinal de compra';
    } else if (lastRSI > 70) {
        return 'Sinal de venda';
    } else {
        return 'Mercado neutro';
    }
}

function calculateRSI(closes, period) {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period; i++) {
        const change = closes[i] - closes[i - 1];
        if (change > 0) {
            gains += change;
        } else {
            losses -= change;
        }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    const rs = avgGain / avgLoss;
    const rsi = [100 - 100 / (1 + rs)];

    for (let i = period; i < closes.length; i++) {
        const change = closes[i] - closes[i - 1];
        let gain = 0;
        let loss = 0;

        if (change > 0) {
            gain = change;
        } else {
            loss = -change;
        }

        gains = ((avgGain * (period - 1)) + gain) / period;
        losses = ((avgLoss * (period - 1)) + loss) / period;

        const rs = gains / losses;
        rsi.push(100 - 100 / (1 + rs));
    }

    return rsi;
}

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('selectPair').style.display = 'block';
    } else {
        alert('Usuário ou senha inválidos!');
    }
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const pair = document.getElementById('pair').value;
    const interval = document.getElementById('timeframe').value;

    document.getElementById('selectPair').style.display = 'none';
    document.getElementById('analysis').style.display = 'block';
    const resultElement = document.getElementById('result');
    resultElement.innerText = 'Analisando...';

    setTimeout(async () => {
        const analysis = await analyzeMarket(pair, interval);
        const currentTime = new Date();
        const minutesToAdd = parseInt(interval, 10);
        currentTime.setMinutes(currentTime.getMinutes() + minutesToAdd);

        resultElement.innerText = `${analysis}\nHora da Entrada: ${currentTime.toLocaleTimeString('pt-BR')}`;
    }, 5000);  // Adiciona um atraso de 5 segundos para simular o processamento
});

document.getElementById('backToSelection').addEventListener('click', () => {
    document.getElementById('analysis').style.display = 'none';
    document.getElementById('selectPair').style.display = 'block';
});
