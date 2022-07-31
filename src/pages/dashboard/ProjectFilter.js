const FILTER_LIST = ['all', 'mine', 'design', 'development', 'sales', 'marketing']

export default function ProjectFilter({ currentFilter, changeFilter }) {

    return (
        <div className="project-filter">
            <nav>
                <p>Filter by:</p>
                {FILTER_LIST.map(filter => (
                    <button
                        key={filter}
                        onClick={() => changeFilter(filter)}
                        className={currentFilter === filter ? 'active' : ''}
                    >
                        {filter}
                    </button>
                ))}
            </nav>
        </div>
    )
}