import './App.css';
import {useEffect, useState} from 'react';
import Pill from './Components/Pill';

function App() {

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setselectedUserSet] = useState(new Set());

  const fetchUsers = ()=>{
    if(searchTerm.trim()===""){
      setSuggestions([]);
      return;
    }

    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
    .then((res) =>res.json())
    .then((data)=>setSuggestions(data))
    .then(console.log)
    .catch((err)=>{
      console.error(err);
    });
  };

  useEffect(()=>{
    fetchUsers()
  },[searchTerm]);

  const handleSelectUser=(user)=>{
    setSelectedUsers([...selectedUsers, user]);
    setselectedUserSet((new Set([...selectedUserSet, user.email])));
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setselectedUserSet(updatedEmails);
  };



  return (
    <div className='user-search-container'>
      <div className="user-search-input">
      {/* pills */}
      {
        selectedUsers.map((user)=>{
          return <Pill key={user.id}
          image={user.image}
          text={`${user.firstName} ${user.lastName}`}
          onClick={() => handleRemoveUser(user)}
           />
        })
      }
      {/* input field suggestions */}
        <div>
          <input type="text" value={searchTerm} 
          onChange={(e)=> setSearchTerm(e.target.value)}
          placeholder="Search for a user"
         />
        {/* search suggestions */}
        {  suggestions?.users ?
        <ul className='suggestions-list'>
          {
            suggestions?.users?.map((user, index)=>{
              return !selectedUserSet.has(user.email) ?
              (<li key={user.email} onClick={()=> handleSelectUser(user)}>
                <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                <span>{`${user.firstName} ${user.lastName}`}</span>
              </li>) 
              :<></>
            })
          }
        </ul>:<></>
}
        </div>
      </div>
    </div>
  );
}

export default App;
