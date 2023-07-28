import useProjectId from './useProjectId';

const ProjectIdProvider = () => {
    const { projectId } = useProjectId();
    return projectId;
};

export default ProjectIdProvider;
