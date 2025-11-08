import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import API_BASE_URL from '../config';
import formatDate from '../utils/dateFormatter';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [project, setProject] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State to store current user's ID
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  const fetchProjectDetails = useCallback(async () => { // Wrap in useCallback
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  }, [id]); // Add id to useCallback dependencies

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

    fetchProjectDetails();
  }, [id, fetchProjectDetails]); // Add fetchProjectDetails to useEffect dependencies

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
      reset({ contributionAmount: '' }); // Reset the form field
      fetchProjectDetails(); // Re-fetch project details to update contributions and funding
    } catch (error) {
      console.error('Error contributing to project:', error);
      setError("general", { type: "manual", message: "Network error or server unreachable." });
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p className="text-xl">Loading project details...</p>
      </div>
    );
  }

  const progressPercentage = (project.current_funding / project.total_target) * 100;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="mb-4">
          <Link to="/projects" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to All Projects
          </Link>
        </p>

        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">{project.title}</h1>
        {currentUserId === project.owner && (
          <div className="mb-6">
            <Link to={`/edit-project/${project.id}`} className="inline-block bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold">
              Edit Project
            </Link>
          </div>
        )}

        <div className="space-y-3 mb-8">
          <p><strong className="text-gray-700 dark:text-gray-300">Details:</strong> <span className="text-gray-900 dark:text-gray-100">{project.details}</span></p>
          <p><strong className="text-gray-700 dark:text-gray-300">Owner:</strong> <Link to={`/profile/${project.owner}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{project.owner_full_name}</Link></p>
          <p><strong className="text-gray-700 dark:text-gray-300">Target:</strong> <span className="font-semibold">${project.total_target}</span></p>
          <p><strong className="text-gray-700 dark:text-gray-300">Funds Raised:</strong> <span className="font-semibold text-green-600">${project.current_funding}</span></p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Progress: {progressPercentage.toFixed(2)}%</p>
          <p><strong className="text-gray-700 dark:text-gray-300">Start Date:</strong> <span className="text-gray-900 dark:text-gray-100">{formatDate(project.start_time)}</span></p>
          <p><strong className="text-gray-700 dark:text-gray-300">End Date:</strong> <span className="text-gray-900 dark:text-gray-100">{formatDate(project.end_time)}</span></p>
        </div>

        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-2">Contribute to this Project</h2>
        <form onSubmit={handleSubmit(onSubmitContribution)} className="space-y-4 mb-8">
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
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
          {errors.contributionAmount && <p className="text-red-500 text-sm mt-1">{errors.contributionAmount.message}</p>}
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general.message}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Contribute
          </button>
        </form>

        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-2">Contributions</h2>
        {project.contributions && project.contributions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.contributions.map((contribution) => (
              <div key={contribution.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <strong className="mr-1">Contributor:</strong>
                  <Link to={`/profile/${contribution.contributor}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{contribution.contributor_full_name}</Link>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <strong className="mr-1">Amount:</strong>
                  <span className="font-semibold text-green-600">${contribution.amount}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong className="mr-1">Date:</strong>
                  {formatDate(contribution.timestamp)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No contributions yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
