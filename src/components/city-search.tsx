import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { useState } from "react";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useSearchLocationsQuery } from "@/hooks/use-weather";
import { CommandSeparator } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavourite } from "@/hooks/use-favourite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useSearchLocationsQuery(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favourites } = useFavourite();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query?.length > 2 && !isLoading && (
            <CommandEmpty>No Cities Found ...</CommandEmpty>
          )}
          {favourites?.length > 0 && (
            <>
              <CommandGroup heading="Recents Searches">
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
                {favourites.map((location) => {
                  return (
                    <CommandItem
                      key={location.id}
                      value={`${location.lat}| ${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      <span>{location.name}</span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          ,{location.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {location.country}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
          {history?.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recents Searches">
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-sm text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                {history.map((location) => {
                  return (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}| ${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{location.name}</span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          ,{location.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {location.country}
                      </span>
                      <span>
                        {format(location.searchedAt, "MMM d ,h:mm:a")}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations?.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations?.map((location) => {
                return (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}| ${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        ,{location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {location.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;