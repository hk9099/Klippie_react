import { useState } from 'react';

const useProjectId = () => {
    const [projectId, setProjectId] = useState(null);

    const handleSetProjectId = (id) => {
        setProjectId(id);
    };

    return { projectId, handleSetProjectId };
};

export default useProjectId;
