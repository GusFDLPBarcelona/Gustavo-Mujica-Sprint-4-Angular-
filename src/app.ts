interface Joke {
    id: string;
    joke: string;
}

interface JokeReport {
    joke: string;
    score: number;
    date: string;
}

const jokeText = document.getElementById('jokeText') as HTMLParagraphElement;
const nextJokeButton = document.getElementById('nextJokeButton') as HTMLButtonElement;
const votingContainer = document.getElementById('voting-container') as HTMLDivElement;
const weatherText = document.getElementById('weatherText') as HTMLParagraphElement;
const weatherIcon = document.getElementById('weatherIcon') as HTMLImageElement;


const reportAcudits: JokeReport[] = [];
let currentJoke: Joke | null = null;

const API_KEY = '6f5f881d8de1fa9d8310060dd6cc07c8';
const CITY = 'Barcelona';

async function fetchWeather(): Promise<void> {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();
        const temperature = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const iconCode = weatherData.weather[0].icon; // Obtener el código del ícono

        weatherText.innerText = `La temperatura en ${CITY} es de ${temperature}°C con ${description}.`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Establecer la fuente del ícono
        weatherIcon.style.display = 'block'; // Asegurarse de que el ícono sea visible
    } catch (error: any) {
        weatherText.innerText = 'Error al cargar la información meteorológica';
        console.error('Error fetching weather:', error);
    }
}
async function fetchJoke(): Promise<Joke> {
    const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const joke: Joke = await response.json();
    return joke;
}

async function displayJoke(): Promise<void> {
    try {
        const joke = await fetchJoke();
        currentJoke = joke;
        jokeText.innerText = joke.joke;
        console.log('New joke displayed:', joke.joke);
    } catch (error: any) {
        jokeText.innerText = 'Error al cargar el chiste';
        console.error('Error fetching joke:', error);
    }
}

function voteJoke(score: number) {
    if (currentJoke) {
        const existingReportIndex = reportAcudits.findIndex(r => r.joke === currentJoke!.joke);
        const report: JokeReport = {
            joke: currentJoke.joke,
            score: score,
            date: new Date().toISOString()
        };

        if (existingReportIndex !== -1) {
            reportAcudits[existingReportIndex] = report; 
        } else {
            reportAcudits.push(report); 
        }

        console.log('Updated reports:', reportAcudits);
    } else {
        console.error('currentJoke is null');
    }
}

votingContainer.addEventListener('click', (event) => {
    if (event.target && (event.target as HTMLElement).matches('.vote-btn')) {
        const target = event.target as HTMLButtonElement;
        const score = Number(target.getAttribute('data-score'));
        console.log('Vote button clicked with score:', score);
        voteJoke(score);
    }
});

nextJokeButton.addEventListener('click', displayJoke);

displayJoke();
fetchWeather();
