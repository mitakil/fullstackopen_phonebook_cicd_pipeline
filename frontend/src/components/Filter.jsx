const Filter = ({ filter, handleFilterChange }) => (
    <div>
        filter: <input value={filter} onChange={handleFilterChange} />
    </div>
)

export default Filter