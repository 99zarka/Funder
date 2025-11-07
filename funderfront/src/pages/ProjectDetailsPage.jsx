import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import API_BASE_URL from '../config';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [project, setProject] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State to store current user's ID
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUserId(decodedToken.user_id); // Assuming user_id is in the token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}/`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const onSubmitContribution = async (data) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/contribute/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: data.contributionAmount,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.amount) {
          setError("contributionAmount", { type: "manual", message: result.amount[0] });
        } else if (Array.isArray(result) && result.includes("You cannot contribute to your own project.")) {
          setError("general", { type: "manual", message: "You cannot contribute to your own project." });
        } else if (Array.isArray(result.non_field_errors) && result.non_field_errors.length > 0) {
          setError("general", { type: "manual", message: result.non_field_errors[0] });
        } else if (result.non_field_errors) {
          setError("general", { type: "manual", message: result.non_field_errors });
        } else {
          setError("general", { type: "manual", message: "An unexpected error occurred during contribution." });
        }
        console.error('Error contributing to project:', result);
        return;
      }

      console.log('Contribution successful:', result);
      // Update project funds or show success message
      setProject((prevProject) => ({
        ...prevProject,
        current_funding: parseFloat(prevProject.current_funding) + parseFloat(data.contributionAmount),
      }));
      reset({ contributionAmount: '' }); // Reset the form field
    } catch (error) {
      console.error('Error contributing to project:', error);
      setError("general", { type: "manual", message: "Network error or server unreachable." });
    }
  };

  if (!project) {
    return <div>Loading project details...</div>;
  }

  return (
    <div>
      <p><Link to="/projects">Back to All Projects</Link></p>
      <h1>{project.title}</h1>
      {currentUserId === project.owner && ( // Conditionally render Edit button
        <p><Link to={`/edit-project/${project.id}`}>Edit Project</Link></p>
      )}
      <p><strong>Details:</strong> {project.details}</p>
      <p><strong>Owner:</strong> <Link to={`/profile/${project.owner}`}>{project.owner_full_name}</Link></p>
      <p><strong>Target:</strong> ${project.total_target}</p>
      <p><strong>Funds Raised:</strong> ${project.current_funding}</p>
      <p><strong>Start Date:</strong> {project.start_time}</p>
      <p><strong>End Date:</strong> {project.end_time}</p>

      <h2>Contribute to this Project</h2>
      <form onSubmit={handleSubmit(onSubmitContribution)}>
        <input
          type="number"
          placeholder="Amount"
          {...register("contributionAmount", {
            required: "Contribution amount is required",
            min: { value: 1, message: "Amount must be at least 1" },
            validate: (value) => {
              const currentFunding = parseFloat(project.current_funding);
              const totalTarget = parseFloat(project.total_target);
              const remainingTarget = totalTarget - currentFunding;
              return parseFloat(value) <= remainingTarget || `Contribution cannot exceed remaining target of $${remainingTarget.toFixed(2)}`;
            },
          })}
        />
        {errors.contributionAmount && <p>{errors.contributionAmount.message}</p>}
        {errors.general && <p style={{ color: 'red' }}>{errors.general.message}</p>}
        <button type="submit">Contribute</button>
      </form>

      <h2>Contributions</h2>
      {project.contributions && project.contributions.length > 0 ? (
        <ul>
          {project.contributions.map((contribution) => (
            <li key={contribution.id}>
              <p><strong>Contributor:</strong> <Link to={`/profile/${contribution.contributor}`}>{contribution.contributor_full_name}</Link></p>
              <p><strong>Amount:</strong> ${contribution.amount}</p>
              <p><strong>Date:</strong> {new Date(contribution.timestamp).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No contributions yet.</p>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
