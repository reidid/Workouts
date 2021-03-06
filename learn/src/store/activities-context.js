import React, { useState, useEffect } from "react";


const saveKeyWords = (lap) => {
  const glosary = JSON.parse( localStorage.getItem('glosary') || '{}');
  const keyWords = lap.resume.match(/#[\w\d\s]*#/ig);
  let modified = false;
  if(keyWords){
    keyWords.forEach((word) => {
      const realWord = word.replaceAll(/#/ig,'').toLowerCase();
      if(!glosary[realWord]){
        glosary[realWord] = { laps: [] };
        modified = true
      }
      glosary[realWord].laps.push(lap.id);
    });
    
    localStorage.setItem('glosary', JSON.stringify(glosary));
  }
  return { modified, glosary }
}

const ActivitiesContext = React.createContext({
  sesionsList: [],
  addSession: () => {},
  endSession: () => {},
  addLap: () => {},
  nextDay: () => {},
  prevDay: () => {},
  totalHours: 0,
});

const TZ_OFFSET = new Date().getTimezoneOffset() * 60000;

const stringDate = (date) => {
  return new Date(date - TZ_OFFSET).toISOString().split("T")[0];
};

const addDay = (date, n) => {
  const nD = new Date(date + ":");
  nD.setDate(nD.getDate() + n);
  return stringDate(nD);
};

const sumHours = (list) => {
  return (list.reduce((ac, cur) => {
    if (!cur.end) {
      return ac;
    }
    const diff = Math.abs(new Date(cur.end) - new Date(cur.start));
    const minutes = Math.floor(diff / 1000 / 60) / 60;
    return (ac += minutes);
  }, 0)).toFixed(2);
};

const DEFAULT_KEY_LOCASTORAGE = stringDate(Date.now());

export const ActivitiesContextProvider = (props) => {
  const [sesionsList, setSesionsList] = useState([]);
  const [keyLocalStorage, setKeyLocalStorage] = useState(
    DEFAULT_KEY_LOCASTORAGE
  );
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const sesions = JSON.parse(localStorage.getItem(keyLocalStorage)) || [];
    setSesionsList(sesions);
  }, [keyLocalStorage]);
  
  useEffect(() => {
    setTotalHours(sumHours(sesionsList));
  }, [sesionsList, keyLocalStorage]);


  const nextDay = () => {
    setKeyLocalStorage(addDay(keyLocalStorage, 1));
  };

  const prevDay = () => {
    setKeyLocalStorage(addDay(keyLocalStorage, -1));
  };

  const addSession = () => {
    setSesionsList((prev) => {
      const newList = [
        {
          name: "S" + (sesionsList.length + 1),
          start: new Date().toISOString(),
          laps: [],
        },
        ...prev,
      ];
      return newList;
    });
  };

  const endSession = () => {
    setSesionsList((prev) => {
      const newMod = [...prev];
      if (newMod[0].laps.length === 0) {
        newMod[0].start = new Date().toISOString();
        newMod[0].end = undefined;
      } else {
        newMod[0].end = newMod[0].laps[0].start;
      }
      return newMod;
    });
  };



  const addLap = (lap) => {
    lap.resume = lap.resume.replaceAll(/#(\w+)#/ig, '.#$1#.');
    setSesionsList((prev) => {
      const modif = JSON.parse(JSON.stringify(prev));
      modif[0].laps.unshift(lap);
      return modif;
    });
    return saveKeyWords(lap);
  };


  return (
    <ActivitiesContext.Provider
      value={{
        sesionsList,
        addSession,
        endSession,
        addLap,
        nextDay,
        prevDay,
        currentDay: keyLocalStorage,
        totalHours
      }}
    >
      {" "}
      {props.children}{" "}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesContext;
