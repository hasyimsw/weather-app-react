import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm, IoMdSearch } from 'react-icons/io';
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsThermometer, BsWind, BsWater } from 'react-icons/bs';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { GrRotateRight } from 'react-icons/gr';

const APIkey = 'b0a5d77880af9178dff6a49a93580a78';

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('Indonesia');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e) => {
    if (inputValue !== '') {
      setLocation(inputValue)
    }

    const input = document.querySelector('input');
    if (input.value === '') {
      setAnimate(true)
      setTimeout(() => {
        setAnimate(false)
      }, 500)
    }

    input.value = '';

    e.preventDefault();
  }

  useEffect(() => {
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios.get(url).then((res) => {
      setTimeout(() => {
        setData(res.data);
        setLoading(false);
      }, 500)
    }).catch(err => {
      setLoading(false);
      setErrorMsg(err);
    })
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [errorMsg])

  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex items-center justify-center'>
        <div>
          <GrRotateRight className='text-6xl animate-spin text-white' />
          {/* no have a data.. */}
        </div>
      </div>
    )
  }

  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-cyan-500' />
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-yellow-500' />
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-cyan-500' />
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-cyan-500' />
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />
      break;
  }

  const date = new Date();

  return (
    <div className='w-full min-h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 py-4 lg:py-0 lg:px-0'>
      {errorMsg && (
        <div className='w-full max-w-[90vh] lg:max-w-[450px] bg-red-500 text-white mb-4 p-4 capitalize rounded-md'>
          {`${errorMsg.response.data.message}`}!
        </div>
      )}
      <form className={`${animate ? 'animate-shake' : 'animate-none'} h-12 bg-black/20 w-full max-w-[480px] rounded-full backdrop-blur-xl mb-4`}>
        <div className='h-full relative flex items-center justify-between px-6'>
          <input onChange={(e) => handleSearch(e)} className='flex-1 bg-transparent py-2 bg-red-500 outline-none text-white font-light text-sm' type="text" placeholder='Search Country ...' />
          <button onClick={(e) => handleSubmit(e)} className='text-xl text-white/80'><IoMdSearch /></button>
        </div>
      </form>
      <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-xl rounded-2xl py-10 px-6'>
        {loading ? (
          <div className='w-full h-full flex py-48 justify-center'>
            <GrRotateRight className='textwhite text-5xl animate-spin' />
          </div>
        ) : (
          <div>
            {/* Card Top */}
            <div className='flex items-center gap-x-5'>
              <div className='text-6xl'>{icon}</div>
              <div>
                <div className='text-2xl font-semibold'>{data.name}, {data.sys.country}</div>
                <div>{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}</div>
              </div>
            </div>
            {/* Card Body */}
            <div className='my-28'>
              <div className='flex items-center justify-center'>
                <div className='text-8xl leading-none font-light'>{parseInt(data.main.temp)}</div>
                <div className='text-3xl'><TbTemperatureCelsius /></div>
              </div>
              <div className='capitalize text-center'>{data.weather[0].description}</div>
            </div>
            {/* Card Bottom */}
            <div className='max-w-sm mx-auto flex flex-col gap-y-6'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  <div className='text-xl'><BsEye /></div>
                  <div>Visibility <span className='ml-2'>{data.visibility / 1000}km</span></div>
                </div>
                <div className='flex items-center gap-x-2'>
                  <div className='text-xl'><BsThermometer /></div>
                  <div className='flex items-center'>Feels like <div className='flex ml-2'>{parseInt(data.main.feels_like)}<TbTemperatureCelsius /></div></div>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  <div className='text-xl'><BsWater /></div>
                  <div>Humidity <span className='ml-2'>{data.main.humidity}%</span></div>
                </div>
                <div className='flex items-center gap-x-2'>
                  <div className='text-xl'><BsWind /></div>
                  <div>Wind <span className='ml-2'>{data.wind.speed}m/s</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
