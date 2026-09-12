import React from 'react';
import HeroIllustration from '../components/HeroIllustration';
import './Careers.css';

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      location: 'Bangalore, India',
      experience: '5-8 years'
    },
    {
      id: 2,
      title: 'Cloud Architect',
      location: 'Hyderabad, India',
      experience: '7+ years'
    },
    {
      id: 3,
      title: 'AI/ML Engineer',
      location: 'Pune, India',
      experience: '3-6 years'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      location: 'Chennai, India',
      experience: '4-7 years'
    },
    {
      id: 5,
      title: 'Business Analyst',
      location: 'Mumbai, India',
      experience: '2-5 years'
    },
    {
      id: 6,
      title: 'Project Manager',
      location: 'Delhi, India',
      experience: '5-10 years'
    },
  ];

  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>Careers at Web4rt</h1>
            <p>Join our team and grow your career</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="careers" />
          </div>
        </div>
      </section>

      <section className="careers-content">
        <div className="container">
          <div className="careers-intro">
            <h2>Why Work at Web4rt?</h2>
            <div className="reasons-grid">
              <div className="reason-card">
                <h3>🌍 Diverse Teams</h3>
                <p>Collaborate with talented people across disciplines and backgrounds</p>
              </div>
              <div className="reason-card">
                <h3>📚 Continuous Learning</h3>
                <p>Access to training and development programs</p>
              </div>
              <div className="reason-card">
                <h3>💰 Competitive Benefits</h3>
                <p>Attractive salary packages and benefits</p>
              </div>
              <div className="reason-card">
                <h3>🚀 Innovation</h3>
                <p>Work on cutting-edge technologies</p>
              </div>
              <div className="reason-card">
                <h3>🤝 Inclusive Culture</h3>
                <p>Diversity and inclusion at the core</p>
              </div>
              <div className="reason-card">
                <h3>📈 Career Growth</h3>
                <p>Clear career progression pathways</p>
              </div>
            </div>
          </div>

          <div className="job-openings">
            <h2>Current Job Openings</h2>
            <div className="jobs-list">
              {jobOpenings.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-experience">{job.experience}</span>
                  </div>
                  <p className="job-location">📍 {job.location}</p>
                  <button className="apply-btn">Apply Now</button>
                </div>
              ))}
            </div>
          </div>

          <section className="internship-section">
            <h2>Internship Programs</h2>
            <p>
              Web4rt offers exciting internship programs for students and freshers.
              Be part of a growing IT company and kick-start your career.
            </p>
            <button className="learn-more-btn">Learn About Internships</button>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Careers;
