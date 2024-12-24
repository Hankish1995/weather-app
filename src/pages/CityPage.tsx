import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemprature from "@/components/HourlyTemprature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { useParams, useSearchParams } from "react-router-dom";
import FavouriteButton from "@/components/favouriteButton";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams, "search params");
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  console.log(lat, lon);
  const coordinates = { lat, lon };

  const forecastQuery = useForecastQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch the weather data,Please try again</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }
  return (
    <div className="space-y-4">
      {/* favourite cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName},{weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavouriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>
      {/* current and hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          {weatherQuery?.data && <CurrentWeather data={weatherQuery?.data} />}
          {/*current weather  */}
          <HourlyTemprature data={forecastQuery.data} />
          {/* hourly weather */}
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery?.data} />
          {/* details */}
          <WeatherForecast data={forecastQuery.data} />
          {/* forecast */}
        </div>
      </div>
    </div>
  );
};

export default CityPage;
