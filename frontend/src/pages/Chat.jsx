import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { uniqBy } from "lodash";

import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import Contact from "../components/Contact";

const Chat = () => {
    const navigate = useNavigate();

    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [offlineUsers, setOfflineUsers] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [nameLoggedIn, setNameLoggedIn] = useState("");
    const [userIdLoggedIn, setUserIdLoggedIn] = useState("");
    const [newMsgTxt, setNewMsgTxt] = useState("");
    const [messages, setMessages] = useState([]);

    const divUnderMsgs = useRef();

    function showOnlineUser(userArr) {
        const users = {};
        userArr.forEach(({ userId, name }) => {
            users[userId] = name;
        });
        setOnlineUsers(users);
        // Object.keys(users).map((userId) => { console.log(users[userId]); })
    }

    function handleMessage(e) {
        const usersData = JSON.parse(e.data);
        console.log({ e, usersData });
        if ("online" in usersData) {
            showOnlineUser(usersData.online);
        }
        else if ("text" in usersData) {
            setMessages(prev => ([...prev, { ...usersData }]));
        }
    }

    async function getUserData() {
        const token = localStorage.getItem("token");
        const headers = { authorization: `JWT ${token}` };
        await axios.get(`${import.meta.env.VITE_BACKEND}/user/profile`, { headers }).then((data) => {
            setNameLoggedIn(data.data.data.name);
            setUserIdLoggedIn(data.data.data.userId);
        })
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMsgTxt,
        }));
        setNewMsgTxt("");
        setMessages(prev => ([...prev, { text: newMsgTxt, sender: userIdLoggedIn, recipient: selectedUserId, _id: Date.now(), }]));
    }

    useEffect(() => {
        const div = divUnderMsgs.current;
        if (div) {
            div.scrollIntoView({ behaviour: 'smooth', block: "end" });
        }
    }, [messages])

    useEffect(() => {
        if (selectedUserId) {
            const token = localStorage.getItem("token");
            const headers = { authorization: `JWT ${token}` };
            axios.get(`${import.meta.env.VITE_BACKEND}/message/${selectedUserId}`, { headers }).then((res) => {
                setMessages(res.data);
            })
        }
    }, [selectedUserId])

    const msgWithoutDupes = uniqBy(messages, "_id");

    async function connectToWs() {
        const token = localStorage.getItem("token");
        if (token) {
            await getUserData();
            const ws = new WebSocket(`ws://${import.meta.env.VITE_HOSTNAME}`, ["Authorization", localStorage.getItem("token")]);
            setWs(ws);
            ws.addEventListener('message', handleMessage);
            ws.addEventListener('close', () => {
                const reconnectTime = 1; // 1 sec
                setTimeout(() => {
                    console.log(`Disconnected, Trying to reconnect in ${reconnectTime} sec`);
                    connectToWs();
                }, reconnectTime * 1000);
            });
        }
    }

    function logout() {
        setWs(null);
        localStorage.removeItem("token");
        return navigate("/");
    }

    useEffect(() => {
        connectToWs();
    }, [])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND}/user/allusers`)
            .then(res => {
                if (userIdLoggedIn !== "") {
                    const offlineUsersArray = res.data
                        .filter(person => person._id !== userIdLoggedIn)
                        .filter(person => !Object.keys(onlineUsers).includes(person._id));
                    const offlineUsers = {};
                    offlineUsersArray.forEach(p => {
                        offlineUsers[p._id] = p;
                    });
                    setOfflineUsers(offlineUsers);
                }
            })
    }, [onlineUsers])

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 flex flex-col">
                <div className="flex-grow">
                    <Logo />
                    {Object.keys(onlineUsers).map((userId) => {
                        if (userId !== userIdLoggedIn) {
                            return <Contact
                                key={userId}
                                online={true}
                                id={userId}
                                name={onlineUsers[userId]}
                                onClick={() => { setSelectedUserId(userId) }}
                                selected={userId === selectedUserId}
                            />
                        }
                    })}
                    {Object.keys(offlineUsers).map((userId) => {
                        if (userId !== userIdLoggedIn) {
                            return <Contact
                                key={userId}
                                online={false}
                                id={userId}
                                name={offlineUsers[userId].name}
                                onClick={() => { setSelectedUserId(userId) }}
                                selected={userId === selectedUserId}
                            />
                        }
                    })}
                </div>
                <div className="p-2 text-center flex items-center justify-center">
                    <span className="mr-2 text-sm text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                        </svg>

                        {nameLoggedIn}
                    </span>
                    <button onClick={logout} className="text-sm text-gray-500 bg-blue-100 py-1 px-2 border rounded">
                        Logout
                    </button>
                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">{!selectedUserId && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-gray-400">
                            Select a chat to start a conversation
                        </div>
                    </div>
                )}

                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 right-0 left-0 bottom-2">
                                {msgWithoutDupes.map(msg => (
                                    <div key={msg._id} className={(msg.sender === userIdLoggedIn ? "text-right" : "text-left")}>
                                        <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (msg.sender === userIdLoggedIn ? "bg-blue-500 text-white" : "bg-white text-gray-700")}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMsgs}></div>
                            </div>
                        </div>
                    )}
                </div>
                {!!selectedUserId && (<form className="flex gap-2" onSubmit={sendMessage}>
                    <input type="text" placeholder="Type your message here" className="bg-white flex-grow border rounded-sm p-2" value={newMsgTxt} onChange={(e) => { setNewMsgTxt(e.target.value) }} />
                    <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
                )}
            </div>
        </div >
    )
}

export default Chat;