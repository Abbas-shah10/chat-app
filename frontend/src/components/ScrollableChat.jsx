import ScrollableFeed from 'react-scrollable-feed'
import Tooltip from '@mui/material/Tooltip';
import ChatContext from '../context/ChatContext'
import { useContext } from 'react'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../config/chatLogics'
import Avatar from '@mui/material/Avatar';



const ScrollableChat = ({ messages }) => {
    const { user } = useContext(ChatContext)

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: 'flex' }} key={m._id}>
                    {isSameSender(messages, m, i, user._id) || isLastMessage(messages, m, i, user._id) && <Tooltip title={m.sender.name} >
                        <Avatar sx={{ marginTop: "7px", marginRight: 1 }} sizes='sm' src={m.sender.avatar} >
                            {m.sender?.name}
                        </Avatar>
                    </Tooltip>}

                    <span style={{
                        backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                        borderRadius: '20px',
                        padding: "5px 15px",
                        maxWidth: '75%',
                        marginLeft: isSameSenderMargin(messages, m, i, user._id),
                        marginTop: isSameUser(messages, m, i) ? 3 : 10

                    }}>{m.content}</span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat