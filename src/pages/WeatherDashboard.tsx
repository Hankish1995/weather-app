import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemprature from "@/components/HourlyTemprature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGeoLocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeoLocation();
  const forecastQuery = useForecastQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      locationQuery.refetch();
      weatherQuery.refetch();
      forecastQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable the location to see your local weather</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch the weather data,Please try again</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* favourite cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
      {/* current and hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {weatherQuery?.data && (
            <CurrentWeather
              data={weatherQuery?.data}
              locationName={locationName}
            />
          )}
          {/*current weather  */}
          <HourlyTemprature data={forecastQuery.data} />
          {/* hourly weather */}
        </div>
        <div>
          {/* details */}
          {/* forecast */}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
