import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firebaseApp } from '../firebase';
import { GenreDetail } from './GenreDetails';

export function TrackList({ data }) {
  const sorted = data.sort((a, b) => b.totalCount - a.totalCount);

  return (
    <div className="mt-[10px] mb-[200px] mx-auto relative flex justify-center items-center top-[40px]">
      <ul className="grid gap-[30px] mx-auto">
        {sorted.map((track, index) => (
          <Track track={track} key={index} />
        ))}
      </ul>
    </div>
  );
}

function Track({ track, index }) {
  const [isHidden, setIsHidden] = useState(true);
  const [genreList, setGenreList] = useState(track.genre);
  const handleClick = () => {
    setIsHidden((prev) => !prev);
  };
  const handleGenreButtonClick = (name) => {
    const temp = genreList.map((item) => {
      if (item.name === name) {
        item.count++;
      }
      return item;
    });
    setGenreList(temp);
  };

  useEffect(() => {
    const db = getFirestore(firebaseApp);
    const ref = doc(db, 'tracks', track.id);

    updateDoc(ref, {
      genre: [...genreList],
      totalCount: track.totalCount++,
    });
  }, [genreList]);

  const sortedGenre = genreList.sort((a, b) => b.count - a.count).map((item) => item.name);
  const genreData = [
    {
      name: '트로트',
      prosPercent: 25,
      consPercent: 75,
      bestComment: {
        content: '아이브가 트로트가 아니면 무엇이 트로트인가?',
      },
    },
    {
      name: 'genre2',
      prosPercent: 30,
      consPercent: 70,
      bestComment: {
        content: '아이브가 트로트가 아니면 무엇이 트로트인가?',
      },
    },
    {
      name: 'genre3',
      prosPercent: 50,
      consPercent: 50,
      bestComment: {
        content: '아이브가 트로트가 아니면 무엇이 트로트인가?',
      },
    },
    {
      name: 'genre4',
      prosPercent: 45,
      consPercent: 55,
      bestComment: {
        content: '아이브가 트로트가 아니면 무엇이 트로트인가?',
      },
    },
    {
      name: 'genre5',
      prosPercent: 15,
      consPercent: 85,
      bestComment: {
        content: '아이브가 트로트가 아니면 무엇이 트로트인가?',
      },
    },
  ];

  return (
    <li className="flex-col rounded-[8px] shadow-[0_4px_24px_rgba(48,62,75,.06)]" key={index}>
      <div className="flex relative">
        <img className="w-[150px] h-[150px]" src={track.image} alt={track.name} />
        <div className="justify-center items-center flex flex-col w-[150px] h-[150px]">
          <div className="text-[14px]">{track.artist}</div>
          <div className="text-[18px]">{track.name}</div>
        </div>
        <div className="flex justify-center items-center gap-[5px]  p-5 h-[130px] w-[400px] flex-wrap">
          {sortedGenre.map((name, i) => (
            <GenreButton name={name} key={i} clickEventHandler={handleGenreButtonClick} />
          ))}
        </div>
        <button
          onClick={handleClick}
          className="absolute text-[black] text-[13px]
          right-[18px] bottom-[15px] w-[50px] h-[20px] font-[500]  "
          type="button"
        >
          {isHidden ? '더보기' : '접기'}
        </button>
      </div>
      <div className="w-full">
        {genreData.map((data, index) => {
          return <GenreDetail isHidden={isHidden} genre={data} key={index} />;
        })}
      </div>
    </li>
  );
}

function GenreButton({ name, index, clickEventHandler }) {
  const [isSelected, setIsSelected] = useState(false);
  const handleClick = (e) => {
    setIsSelected((prev) => !prev);
    clickEventHandler(name);
  };

  return (
    <button
      key={index}
      onClick={handleClick}
      className="flex bg-[white] justify-center text-[15px] w-[100px] border-[1px] rounded-[25px] border-[#243c5a]"
    >
      {name}
    </button>
  );
}
