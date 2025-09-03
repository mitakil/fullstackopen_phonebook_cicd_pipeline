const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className={`notification fade-in ${message.type}`}>
            {message.message}
        </div>
    )
}

export default Notification


