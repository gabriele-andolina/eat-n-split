import { useState } from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

export default function App() {
    const [friends, setFriends] = useState(initialFriends);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    function handleShowAddFriend() {
        setShowAddFriend((show) => !show);
    }

    function handleAddFriend(friend) {
        setFriends((friends) => [...friends, friend]);
        // Here we spread the original friends array and add the new friend item at the end. We're creating
        // a new array. We don't push the new friend to the original array because doing so
        // would mutate it and React wouldn't re-render the UI.
        setShowAddFriend(false);
    }

    function handleSelection(friend) {
        // setSelectedFriend(friend);
        setSelectedFriend((current) =>
            current?.id === friend.id ? null : friend
        );
        setShowAddFriend(false);
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendsList
                    friends={friends}
                    selectedFriend={selectedFriend}
                    onSelection={handleSelection}
                />

                {showAddFriend && (
                    <AddFriendForm onAddFriend={handleAddFriend} />
                )}

                <Button onClick={handleShowAddFriend}>
                    {showAddFriend ? "Close" : "Add Friend"}
                </Button>
            </div>
            {selectedFriend && (
                <SplitBillForm selectedFriend={selectedFriend} />
            )}
        </div>
    );
}

function Button({ onClick, children }) {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
    return (
        <ul>
            {friends.map((friend) => (
                <Friend
                    friend={friend}
                    key={friend.id}
                    selectedFriend={selectedFriend}
                    onSelection={onSelection}
                />
            ))}
        </ul>
    );
}

function Friend({ friend, onSelection, selectedFriend }) {
    const isSelected = selectedFriend?.id === friend.id;

    return (
        <li className={isSelected ? "selected" : ""}>
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>

            {friend.balance < 0 && (
                <p className="red">
                    You owe {friend.name} €{Math.abs(friend.balance)}
                </p>
            )}
            {friend.balance > 0 && (
                <p className="green">
                    {friend.name} owes you €{Math.abs(friend.balance)}
                </p>
            )}
            {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

            <Button onClick={() => onSelection(friend)}>
                {isSelected ? "Close" : "Select"}
            </Button>
        </li>
    );
}

function AddFriendForm({ onAddFriend }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !image) return;

        const id = crypto.randomUUID();

        const newFriend = {
            id,
            name,
            image: `${image}?=${id}`,
            balance: 0,
        };

        onAddFriend(newFriend);

        setName("");
        setImage("https://i.pravatar.cc/48");
    }

    return (
        <form className="add-friend-form" onSubmit={handleSubmit}>
            <label>Friend name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label>Image URL</label>
            <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />

            <Button>Add</Button>
        </form>
    );
}

function SplitBillForm({ selectedFriend }) {
    return (
        <form className="split-bill-form">
            <h2>Split a bill with {selectedFriend.name}</h2>

            <label>Bill value</label>
            <input type="text" />

            <label>Your expense</label>
            <input type="text" />

            <label>{selectedFriend.name}'s expense</label>
            <input type="text" disabled />

            <label>Who's paying the bill?</label>
            <select>
                <option value="user">You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>

            <Button>Split bill</Button>
        </form>
    );
}
