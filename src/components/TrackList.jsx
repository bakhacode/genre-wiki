import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { GenreDetail } from './GenreDetails';

export function TrackList({ data, userId }) {
  const sortedData = data.sort((a, b) => b.totalCount - a.totalCount);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (userId) {
      const ref = doc(db, 'users', userId);

      (async () => {
        const querySnapshot = await getDoc(ref);
        const querySnapshotData = querySnapshot.data();

        setUserData(querySnapshotData);
      })();
    }
  }, [userId]);

  return (
    <div className="mt-[10px] mb-[200px] mx-auto relative flex justify-center items-center top-[40px]">
      <ul className="grid gap-[30px] mx-auto">
        {sortedData.map((track, index) => (
          <Track track={track} userData={userData} key={index} userId={userId} />
        ))}
      </ul>
    </div>
  );
}

function Track({ track, userData, index, userId }) {
  const [isHidden, setIsHidden] = useState(true);
  const [genreList, setGenreList] = useState(track.genre);

  const userVotedGenres = [];
  if (userData.votedGenre && track.id in userData.votedGenre) {
    userVotedGenres.push(...userData.votedGenre[track.id]);
  }

  const handleSeeMoreClick = () => {
    setIsHidden(!isHidden);
  };

  const handleGenreButtonClick = (name) => {
    const isVoted = checkVotedGenre(userData.votedGenre[track.id], name);

    const newGenreList = genreList.map((item) => {
      if (isVoted && item.name === name) {
        item.count -= 1;
        track.totalCount -= 1;
      } else {
        item.count += 1;
        track.totalCount += 1;
      }

      return item;
    });

    setGenreList(newGenreList);
    updateGenreCount(genreList);
    updateUserData(isVoted, name);
  };

  const updateGenreCount = (genreList) => {
    const tracksRef = doc(db, 'tracks', track.id);

    updateDoc(tracksRef, {
      genre: [...genreList],
      totalCount: track.totalCount,
    });
  };

  const updateUserData = (isVoted, name) => {
    const usersRef = doc(db, 'users', userId);
    const newUserData = Object.assign(userData);

    if (isVoted) {
      if (newUserData.votedGenre[track.id].length === 1) {
        delete newUserData.votedGenre[track.id];
      } else {
        newUserData.votedGenre[track.id] = newUserData.votedGenre[track.id].filter((genre) => genre !== name);
      }
    } else {
      if (newUserData.votedGenre.hasOwnProperty(track.id)) {
        newUserData.votedGenre[track.id].push(name);
      } else {
        newUserData.votedGenre[track.id] = [name];
      }
    }

    updateDoc(usersRef, newUserData);
  };

  const checkVotedGenre = (votedGenre, name) => {
    return votedGenre?.includes(name);
  };

  const sortedGenre = genreList.sort((a, b) => b.count - a.count).map((item) => item.name);

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
            <GenreButton
              name={name}
              key={i}
              clickEventHandler={handleGenreButtonClick}
              voted={userVotedGenres.find((element) => element === name)}
            />
          ))}
        </div>
        <button
          onClick={handleSeeMoreClick}
          className="absolute text-[black] text-[13px]
          right-[18px] bottom-[15px] w-[50px] h-[20px] font-[500]  "
          type="button"
        >
          {isHidden ? '더보기' : '접기'}
        </button>
      </div>
      <div className="w-full">
        {isHidden ? '' : <div>{track.totalCount}</div>}

        {genreList.map((data, index) => {
          return <GenreDetail isHidden={isHidden} genreList={data} key={index} total={track.totalCount} />;
        })}
      </div>
    </li>
  );
}

function GenreButton({ name, index, clickEventHandler, voted }) {
  const [isSelected, setIsSelected] = useState(voted);
  const handleGenreButtonClick = () => {
    setIsSelected(!isSelected);
    clickEventHandler(name);
  };

  return (
    <button
      key={index}
      onClick={handleGenreButtonClick}
      className={`flex justify-center text-[15px] w-[100px] border-[1px] rounded-[25px] border-[#243c5a] ${
        isSelected ? 'bg-[#FFFF64]' : 'bg-[white]'
      }`}
    >
      {name}
    </button>
  );
}
