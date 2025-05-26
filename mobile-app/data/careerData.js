export const CAREER_CATEGORIES = [
  {
    id: 'technology',
    name: 'Technology & Engineering',
    icon: 'laptop',
    color: '#0ea5e9',
    jobs: [
      { id: 'software-engineer', name: 'Software Engineer', skills: ['JavaScript', 'Python', 'Java', 'Git', 'Agile', 'Problem Solving', 'Algorithms', 'Data Structures'] },
      { id: 'frontend-developer', name: 'Frontend Developer', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Responsive Design', 'TypeScript'] },
      { id: 'backend-developer', name: 'Backend Developer', skills: ['Node.js', 'Python', 'Java', 'APIs', 'Databases', 'Server Architecture', 'Security', 'Microservices'] },
      { id: 'fullstack-developer', name: 'Full Stack Developer', skills: ['Frontend', 'Backend', 'Databases', 'DevOps', 'API Design', 'System Architecture'] },
      { id: 'data-analyst', name: 'Data Analyst', skills: ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Statistics', 'Data Visualization', 'Critical Thinking'] },
      { id: 'data-scientist', name: 'Data Scientist', skills: ['Machine Learning', 'Python', 'R', 'Statistics', 'Deep Learning', 'TensorFlow', 'Pandas', 'NumPy'] },
      { id: 'data-engineer', name: 'Data Engineer', skills: ['ETL', 'Apache Spark', 'Hadoop', 'SQL', 'Python', 'Data Pipelines', 'Cloud Platforms', 'Big Data'] },
      { id: 'cybersecurity-analyst', name: 'Cybersecurity Analyst', skills: ['Network Security', 'Penetration Testing', 'Risk Assessment', 'SIEM', 'Incident Response', 'Compliance'] },
      { id: 'ai-ml-engineer', name: 'AI/ML Engineer', skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'MLOps', 'Computer Vision', 'NLP'] },
      { id: 'web-developer', name: 'Web Developer', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Responsive Design', 'Web Performance', 'SEO'] },
      { id: 'mobile-developer', name: 'Mobile App Developer', skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI/UX'] },
      { id: 'cloud-engineer', name: 'Cloud Engineer', skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Infrastructure as Code'] },
      { id: 'devops-engineer', name: 'DevOps Engineer', skills: ['CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'Ansible', 'Monitoring', 'Automation', 'Linux'] },
      { id: 'network-engineer', name: 'Network Engineer', skills: ['Cisco', 'Network Protocols', 'Routing', 'Switching', 'VPN', 'Network Security', 'Troubleshooting'] },
      { id: 'database-admin', name: 'Database Administrator', skills: ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Backup Recovery', 'Performance Tuning', 'Security'] },
      { id: 'systems-analyst', name: 'Systems Analyst', skills: ['Systems Design', 'Requirements Analysis', 'SDLC', 'Business Analysis', 'Documentation'] },
      { id: 'it-support', name: 'IT Support Specialist', skills: ['Technical Support', 'Hardware Troubleshooting', 'Windows', 'macOS', 'Linux', 'Customer Service'] },
      { id: 'product-manager-tech', name: 'Technical Product Manager', skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Roadmapping', 'Stakeholder Management'] },
      { id: 'qa-engineer', name: 'QA Engineer', skills: ['Test Automation', 'Selenium', 'Manual Testing', 'Bug Tracking', 'Test Planning', 'Quality Assurance'] },
      { id: 'blockchain-developer', name: 'Blockchain Developer', skills: ['Solidity', 'Smart Contracts', 'Ethereum', 'Web3', 'Cryptocurrency', 'DeFi'] },
      { id: 'game-developer', name: 'Game Developer', skills: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Game Design', '3D Modeling', 'Physics'] },
      { id: 'embedded-systems', name: 'Embedded Systems Engineer', skills: ['C/C++', 'Microcontrollers', 'RTOS', 'Hardware Design', 'IoT', 'Firmware'] }
    ]
  },
  {
    id: 'business-finance',
    name: 'Business & Finance',
    icon: 'chart-line',
    color: '#10b981',
    jobs: [
      { id: 'project-manager', name: 'Project Manager', skills: ['Project Planning', 'Risk Management', 'Leadership', 'Agile', 'Scrum', 'Budgeting', 'Communication'] },
      { id: 'business-analyst', name: 'Business Analyst', skills: ['Requirements Gathering', 'Process Modeling', 'Data Analysis', 'Stakeholder Management', 'Documentation'] },
      { id: 'financial-analyst', name: 'Financial Analyst', skills: ['Financial Modeling', 'Excel', 'Forecasting', 'Valuation', 'Financial Statements', 'Investment Analysis'] },
      { id: 'investment-banker', name: 'Investment Banker', skills: ['Financial Modeling', 'M&A', 'Capital Markets', 'Valuation', 'Client Relations', 'Presentation Skills'] },
      { id: 'accountant', name: 'Accountant', skills: ['GAAP', 'Tax Preparation', 'QuickBooks', 'Financial Reporting', 'Auditing', 'Bookkeeping'] },
      { id: 'cpa', name: 'Certified Public Accountant', skills: ['Advanced Accounting', 'Tax Law', 'Auditing', 'Financial Analysis', 'Compliance', 'Ethics'] },
      { id: 'marketing-manager', name: 'Marketing Manager', skills: ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Campaign Management', 'Analytics', 'Brand Strategy'] },
      { id: 'digital-marketer', name: 'Digital Marketing Specialist', skills: ['Google Ads', 'Facebook Ads', 'Email Marketing', 'Content Marketing', 'Analytics', 'A/B Testing'] },
      { id: 'sales-manager', name: 'Sales Manager', skills: ['Sales Strategy', 'CRM', 'Negotiation', 'Team Leadership', 'Pipeline Management', 'Customer Relations'] },
      { id: 'sales-representative', name: 'Sales Representative', skills: ['Prospecting', 'Cold Calling', 'Relationship Building', 'Product Knowledge', 'Closing Deals'] },
      { id: 'hr-manager', name: 'Human Resources Manager', skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'HR Policies', 'Compliance', 'Training'] },
      { id: 'hr-generalist', name: 'HR Generalist', skills: ['Recruiting', 'Onboarding', 'Benefits Administration', 'Employee Relations', 'HRIS'] },
      { id: 'operations-manager', name: 'Operations Manager', skills: ['Process Optimization', 'Supply Chain', 'Logistics', 'Team Management', 'KPI Tracking'] },
      { id: 'supply-chain-manager', name: 'Supply Chain Manager', skills: ['Logistics', 'Procurement', 'Vendor Management', 'Inventory Control', 'Cost Optimization'] },
      { id: 'economist', name: 'Economist', skills: ['Economic Research', 'Statistical Analysis', 'Econometrics', 'Policy Analysis', 'Forecasting'] },
      { id: 'management-consultant', name: 'Management Consultant', skills: ['Strategy', 'Problem Solving', 'Presentation', 'Client Management', 'Industry Analysis'] },
      { id: 'real-estate-agent', name: 'Real Estate Agent', skills: ['Sales', 'Negotiation', 'Market Analysis', 'Customer Service', 'Property Valuation'] },
      { id: 'insurance-agent', name: 'Insurance Agent', skills: ['Sales', 'Risk Assessment', 'Customer Service', 'Product Knowledge', 'Claims Processing'] },
      { id: 'financial-advisor', name: 'Financial Advisor', skills: ['Investment Planning', 'Retirement Planning', 'Risk Management', 'Client Relations', 'Financial Analysis'] },
      { id: 'business-development', name: 'Business Development Manager', skills: ['Partnership Development', 'Market Research', 'Negotiation', 'Strategic Planning', 'Networking'] }
    ]
  },
  {
    id: 'healthcare-medical',
    name: 'Healthcare & Medical',
    icon: 'medical-bag',
    color: '#ef4444',
    jobs: [
      { id: 'medical-doctor', name: 'Medical Doctor', skills: ['Clinical Diagnosis', 'Patient Care', 'Medical Knowledge', 'Surgery', 'Emergency Medicine', 'Communication'] },
      { id: 'specialist-doctor', name: 'Medical Specialist', skills: ['Specialized Medicine', 'Advanced Procedures', 'Research', 'Patient Consultation', 'Medical Technology'] },
      { id: 'surgeon', name: 'Surgeon', skills: ['Surgical Procedures', 'Precision', 'Decision Making', 'Anatomy', 'Medical Technology', 'Stamina'] },
      { id: 'nurse', name: 'Registered Nurse', skills: ['Patient Care', 'Medical Procedures', 'Medication Administration', 'Communication', 'Empathy'] },
      { id: 'nurse-practitioner', name: 'Nurse Practitioner', skills: ['Advanced Practice', 'Diagnosis', 'Treatment Planning', 'Prescribing', 'Patient Education'] },
      { id: 'pharmacist', name: 'Pharmacist', skills: ['Pharmacology', 'Drug Interactions', 'Patient Counseling', 'Prescription Verification', 'Clinical Knowledge'] },
      { id: 'dentist', name: 'Dentist', skills: ['Oral Surgery', 'Preventive Care', 'Dental Procedures', 'Patient Communication', 'Manual Dexterity'] },
      { id: 'dental-hygienist', name: 'Dental Hygienist', skills: ['Teeth Cleaning', 'Oral Health Education', 'X-rays', 'Patient Care', 'Preventive Care'] },
      { id: 'physical-therapist', name: 'Physical Therapist', skills: ['Rehabilitation', 'Exercise Therapy', 'Patient Assessment', 'Treatment Planning', 'Anatomy'] },
      { id: 'occupational-therapist', name: 'Occupational Therapist', skills: ['Adaptive Techniques', 'Patient Assessment', 'Treatment Planning', 'Assistive Technology'] },
      { id: 'psychologist', name: 'Psychologist', skills: ['Counseling', 'Psychological Assessment', 'Therapy Techniques', 'Research', 'Empathy'] },
      { id: 'psychiatrist', name: 'Psychiatrist', skills: ['Mental Health Diagnosis', 'Medication Management', 'Therapy', 'Crisis Intervention'] },
      { id: 'veterinarian', name: 'Veterinarian', skills: ['Animal Medicine', 'Surgery', 'Diagnostic Skills', 'Animal Behavior', 'Client Communication'] },
      { id: 'medical-technologist', name: 'Medical Technologist', skills: ['Laboratory Testing', 'Equipment Operation', 'Quality Control', 'Data Analysis'] },
      { id: 'radiologic-technologist', name: 'Radiologic Technologist', skills: ['Medical Imaging', 'Equipment Operation', 'Patient Positioning', 'Radiation Safety'] },
      { id: 'respiratory-therapist', name: 'Respiratory Therapist', skills: ['Pulmonary Care', 'Ventilator Management', 'Patient Assessment', 'Emergency Response'] },
      { id: 'healthcare-admin', name: 'Healthcare Administrator', skills: ['Healthcare Management', 'Budgeting', 'Compliance', 'Staff Management', 'Operations'] }
    ]
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    icon: 'school',
    color: '#8b5cf6',
    jobs: [
      { id: 'elementary-teacher', name: 'Elementary School Teacher', skills: ['Curriculum Development', 'Classroom Management', 'Child Development', 'Communication', 'Patience'] },
      { id: 'high-school-teacher', name: 'High School Teacher', skills: ['Subject Expertise', 'Lesson Planning', 'Student Assessment', 'Classroom Management', 'Technology Integration'] },
      { id: 'special-education-teacher', name: 'Special Education Teacher', skills: ['Individualized Education', 'Behavioral Management', 'Adaptive Teaching', 'Patience', 'Collaboration'] },
      { id: 'professor', name: 'Professor', skills: ['Research', 'Academic Writing', 'Lecturing', 'Mentorship', 'Grant Writing', 'Publishing'] },
      { id: 'school-counselor', name: 'School Counselor', skills: ['Student Counseling', 'Academic Planning', 'Crisis Intervention', 'Communication', 'Psychology'] },
      { id: 'librarian', name: 'Librarian', skills: ['Information Management', 'Research Assistance', 'Digital Literacy', 'Cataloging', 'Customer Service'] },
      { id: 'instructional-designer', name: 'Instructional Designer', skills: ['Curriculum Design', 'E-learning', 'Learning Management Systems', 'Assessment Design', 'Technology'] },
      { id: 'training-specialist', name: 'Corporate Training Specialist', skills: ['Adult Learning', 'Training Development', 'Presentation Skills', 'Assessment', 'LMS'] },
      { id: 'education-administrator', name: 'Education Administrator', skills: ['Educational Leadership', 'Budget Management', 'Policy Development', 'Staff Management'] },
      { id: 'tutor', name: 'Private Tutor', skills: ['Subject Expertise', 'One-on-One Teaching', 'Patience', 'Adaptability', 'Assessment'] }
    ]
  },
  {
    id: 'creative-media',
    name: 'Creative & Media',
    icon: 'palette',
    color: '#ec4899',
    jobs: [
      { id: 'graphic-designer', name: 'Graphic Designer', skills: ['Adobe Creative Suite', 'Typography', 'Brand Design', 'Layout Design', 'Color Theory', 'Creativity'] },
      { id: 'web-designer', name: 'Web Designer', skills: ['UI Design', 'HTML/CSS', 'Responsive Design', 'Adobe XD', 'Figma', 'User Experience'] },
      { id: 'ux-ui-designer', name: 'UX/UI Designer', skills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'Usability Testing'] },
      { id: 'photographer', name: 'Photographer', skills: ['Photography Techniques', 'Photo Editing', 'Lighting', 'Composition', 'Adobe Lightroom', 'Photoshop'] },
      { id: 'videographer', name: 'Videographer', skills: ['Video Production', 'Video Editing', 'Cinematography', 'Adobe Premiere', 'Final Cut Pro', 'Storytelling'] },
      { id: 'video-editor', name: 'Video Editor', skills: ['Video Editing Software', 'Color Correction', 'Audio Editing', 'Motion Graphics', 'Storytelling'] },
      { id: 'animator', name: 'Animator', skills: ['2D/3D Animation', 'After Effects', 'Maya', 'Character Design', 'Storyboarding', 'Creativity'] },
      { id: 'journalist', name: 'Journalist', skills: ['Writing', 'Research', 'Interviewing', 'Fact-Checking', 'Deadline Management', 'Ethics'] },
      { id: 'content-writer', name: 'Content Writer', skills: ['SEO Writing', 'Content Strategy', 'Research', 'Editing', 'Social Media', 'Blogging'] },
      { id: 'copywriter', name: 'Copywriter', skills: ['Persuasive Writing', 'Brand Voice', 'Marketing Copy', 'A/B Testing', 'Creativity'] },
      { id: 'author', name: 'Author', skills: ['Creative Writing', 'Storytelling', 'Editing', 'Research', 'Self-Discipline', 'Publishing'] },
      { id: 'translator', name: 'Translator', skills: ['Language Proficiency', 'Cultural Knowledge', 'Translation Software', 'Attention to Detail'] },
      { id: 'interpreter', name: 'Interpreter', skills: ['Real-time Translation', 'Active Listening', 'Cultural Sensitivity', 'Quick Thinking'] },
      { id: 'social-media-manager', name: 'Social Media Manager', skills: ['Social Media Strategy', 'Content Creation', 'Community Management', 'Analytics', 'Scheduling Tools'] },
      { id: 'art-director', name: 'Art Director', skills: ['Creative Direction', 'Team Leadership', 'Brand Strategy', 'Visual Communication', 'Project Management'] },
      { id: 'interior-designer', name: 'Interior Designer', skills: ['Space Planning', 'Color Theory', 'CAD Software', 'Client Relations', 'Project Management'] }
    ]
  },
  {
    id: 'engineering-construction',
    name: 'Engineering & Construction',
    icon: 'hammer-wrench',
    color: '#f59e0b',
    jobs: [
      { id: 'civil-engineer', name: 'Civil Engineer', skills: ['Structural Analysis', 'AutoCAD', 'Project Management', 'Construction Materials', 'Surveying'] },
      { id: 'mechanical-engineer', name: 'Mechanical Engineer', skills: ['Mechanical Design', 'CAD Software', 'Thermodynamics', 'Materials Science', 'Manufacturing'] },
      { id: 'electrical-engineer', name: 'Electrical Engineer', skills: ['Circuit Design', 'Power Systems', 'Electronics', 'MATLAB', 'Signal Processing'] },
      { id: 'chemical-engineer', name: 'Chemical Engineer', skills: ['Process Design', 'Chemical Processes', 'Safety Protocols', 'Process Optimization'] },
      { id: 'aerospace-engineer', name: 'Aerospace Engineer', skills: ['Aerodynamics', 'Flight Systems', 'Materials Science', 'CAD Software', 'Testing'] },
      { id: 'biomedical-engineer', name: 'Biomedical Engineer', skills: ['Medical Devices', 'Biology', 'Engineering Design', 'Regulatory Compliance'] },
      { id: 'environmental-engineer', name: 'Environmental Engineer', skills: ['Environmental Assessment', 'Pollution Control', 'Sustainability', 'Regulatory Knowledge'] },
      { id: 'architect', name: 'Architect', skills: ['Architectural Design', 'AutoCAD', 'Building Codes', 'Project Management', 'Creativity'] },
      { id: 'construction-manager', name: 'Construction Manager', skills: ['Project Management', 'Construction Planning', 'Safety Management', 'Budgeting', 'Leadership'] },
      { id: 'construction-worker', name: 'Construction Worker', skills: ['Construction Techniques', 'Safety Protocols', 'Physical Stamina', 'Teamwork', 'Tool Operation'] },
      { id: 'electrician', name: 'Electrician', skills: ['Electrical Installation', 'Wiring', 'Electrical Codes', 'Troubleshooting', 'Safety'] },
      { id: 'plumber', name: 'Plumber', skills: ['Pipe Installation', 'Plumbing Systems', 'Problem Solving', 'Customer Service', 'Safety'] },
      { id: 'hvac-technician', name: 'HVAC Technician', skills: ['HVAC Systems', 'Refrigeration', 'Electrical Knowledge', 'Troubleshooting', 'Customer Service'] },
      { id: 'surveyor', name: 'Land Surveyor', skills: ['Surveying Equipment', 'GPS Technology', 'Mapping', 'Legal Knowledge', 'Precision'] }
    ]
  },
  {
    id: 'science-research',
    name: 'Science & Research',
    icon: 'flask',
    color: '#06b6d4',
    jobs: [
      { id: 'research-scientist', name: 'Research Scientist', skills: ['Scientific Method', 'Data Analysis', 'Research Design', 'Grant Writing', 'Publication'] },
      { id: 'biologist', name: 'Biologist', skills: ['Laboratory Research', 'Field Studies', 'Data Analysis', 'Scientific Writing', 'Microscopy'] },
      { id: 'chemist', name: 'Chemist', skills: ['Chemical Analysis', 'Laboratory Techniques', 'Spectroscopy', 'Safety Protocols', 'Research'] },
      { id: 'physicist', name: 'Physicist', skills: ['Theoretical Physics', 'Experimentation', 'Mathematical Modeling', 'Data Analysis', 'Research'] },
      { id: 'astronomer', name: 'Astronomer', skills: ['Observational Astronomy', 'Data Analysis', 'Telescope Operation', 'Astrophysics', 'Research'] },
      { id: 'geologist', name: 'Geologist', skills: ['Fieldwork', 'Rock Analysis', 'GIS', 'Environmental Assessment', 'Data Interpretation'] },
      { id: 'environmental-scientist', name: 'Environmental Scientist', skills: ['Environmental Monitoring', 'Data Collection', 'Policy Analysis', 'Field Research'] },
      { id: 'marine-biologist', name: 'Marine Biologist', skills: ['Marine Ecosystems', 'Underwater Research', 'Data Collection', 'Conservation', 'Diving'] },
      { id: 'meteorologist', name: 'Meteorologist', skills: ['Weather Forecasting', 'Climate Analysis', 'Data Interpretation', 'Computer Modeling'] },
      { id: 'forensic-scientist', name: 'Forensic Scientist', skills: ['Evidence Analysis', 'Laboratory Techniques', 'Attention to Detail', 'Report Writing'] },
      { id: 'food-scientist', name: 'Food Scientist', skills: ['Food Safety', 'Product Development', 'Quality Control', 'Nutrition', 'Laboratory Testing'] }
    ]
  },
  {
    id: 'legal-public-service',
    name: 'Legal & Public Service',
    icon: 'gavel',
    color: '#64748b',
    jobs: [
      { id: 'lawyer', name: 'Lawyer', skills: ['Legal Research', 'Case Preparation', 'Negotiation', 'Court Procedures', 'Client Relations', 'Writing'] },
      { id: 'corporate-lawyer', name: 'Corporate Lawyer', skills: ['Corporate Law', 'Contract Negotiation', 'Mergers & Acquisitions', 'Compliance', 'Business Strategy'] },
      { id: 'criminal-lawyer', name: 'Criminal Defense Lawyer', skills: ['Criminal Law', 'Trial Advocacy', 'Investigation', 'Client Counseling', 'Court Procedures'] },
      { id: 'paralegal', name: 'Paralegal', skills: ['Legal Research', 'Document Preparation', 'Case Management', 'Legal Software', 'Communication'] },
      { id: 'judge', name: 'Judge', skills: ['Legal Knowledge', 'Decision Making', 'Impartiality', 'Court Management', 'Legal Writing'] },
      { id: 'police-officer', name: 'Police Officer', skills: ['Law Enforcement', 'Investigation', 'Community Relations', 'Physical Fitness', 'Crisis Management'] },
      { id: 'detective', name: 'Detective', skills: ['Criminal Investigation', 'Evidence Collection', 'Interviewing', 'Report Writing', 'Critical Thinking'] },
      { id: 'firefighter', name: 'Firefighter', skills: ['Fire Suppression', 'Emergency Response', 'Rescue Operations', 'Physical Fitness', 'Teamwork'] },
      { id: 'paramedic', name: 'Paramedic', skills: ['Emergency Medical Care', 'Life Support', 'Patient Assessment', 'Crisis Management', 'Medical Equipment'] },
      { id: 'social-worker', name: 'Social Worker', skills: ['Case Management', 'Counseling', 'Advocacy', 'Crisis Intervention', 'Community Resources'] },
      { id: 'probation-officer', name: 'Probation Officer', skills: ['Case Management', 'Risk Assessment', 'Counseling', 'Report Writing', 'Law Enforcement'] },
      { id: 'urban-planner', name: 'Urban Planner', skills: ['Land Use Planning', 'GIS', 'Policy Analysis', 'Community Engagement', 'Zoning'] },
      { id: 'government-analyst', name: 'Government Policy Analyst', skills: ['Policy Research', 'Data Analysis', 'Report Writing', 'Public Administration'] }
    ]
  },
  {
    id: 'hospitality-service',
    name: 'Hospitality & Service',
    icon: 'silverware-fork-knife',
    color: '#84cc16',
    jobs: [
      { id: 'chef', name: 'Chef', skills: ['Culinary Techniques', 'Menu Planning', 'Kitchen Management', 'Food Safety', 'Creativity', 'Leadership'] },
      { id: 'sous-chef', name: 'Sous Chef', skills: ['Cooking Techniques', 'Kitchen Operations', 'Staff Training', 'Inventory Management', 'Quality Control'] },
      { id: 'pastry-chef', name: 'Pastry Chef', skills: ['Baking Techniques', 'Dessert Creation', 'Decoration', 'Recipe Development', 'Precision'] },
      { id: 'restaurant-manager', name: 'Restaurant Manager', skills: ['Operations Management', 'Staff Supervision', 'Customer Service', 'Inventory', 'P&L Management'] },
      { id: 'hotel-manager', name: 'Hotel Manager', skills: ['Hospitality Management', 'Guest Relations', 'Operations', 'Revenue Management', 'Staff Leadership'] },
      { id: 'event-planner', name: 'Event Planner', skills: ['Event Coordination', 'Vendor Management', 'Budget Planning', 'Timeline Management', 'Client Relations'] },
      { id: 'wedding-planner', name: 'Wedding Planner', skills: ['Wedding Coordination', 'Vendor Relations', 'Budget Management', 'Design', 'Client Communication'] },
      { id: 'travel-agent', name: 'Travel Agent', skills: ['Travel Planning', 'Booking Systems', 'Customer Service', 'Destination Knowledge', 'Sales'] },
      { id: 'tour-guide', name: 'Tour Guide', skills: ['Public Speaking', 'Historical Knowledge', 'Customer Service', 'Language Skills', 'Leadership'] },
      { id: 'flight-attendant', name: 'Flight Attendant', skills: ['Customer Service', 'Safety Procedures', 'Emergency Response', 'Communication', 'Cultural Sensitivity'] },
      { id: 'concierge', name: 'Hotel Concierge', skills: ['Customer Service', 'Local Knowledge', 'Problem Solving', 'Communication', 'Networking'] },
      { id: 'bartender', name: 'Bartender', skills: ['Mixology', 'Customer Service', 'Cash Handling', 'Inventory Management', 'Communication'] }
    ]
  },
  {
    id: 'transportation-logistics',
    name: 'Transportation & Logistics',
    icon: 'truck',
    color: '#f97316',
    jobs: [
      { id: 'pilot', name: 'Commercial Pilot', skills: ['Flight Operations', 'Navigation', 'Aviation Regulations', 'Decision Making', 'Communication'] },
      { id: 'air-traffic-controller', name: 'Air Traffic Controller', skills: ['Air Traffic Management', 'Communication', 'Quick Decision Making', 'Radar Systems'] },
      { id: 'logistics-manager', name: 'Logistics Manager', skills: ['Supply Chain Management', 'Inventory Control', 'Transportation Planning', 'Cost Optimization'] },
      { id: 'supply-chain-analyst', name: 'Supply Chain Analyst', skills: ['Data Analysis', 'Inventory Management', 'Process Optimization', 'Forecasting'] },
      { id: 'warehouse-manager', name: 'Warehouse Manager', skills: ['Warehouse Operations', 'Inventory Management', 'Staff Supervision', 'Safety Management'] },
      { id: 'truck-driver', name: 'Truck Driver', skills: ['Commercial Driving', 'Route Planning', 'Vehicle Maintenance', 'Safety Compliance', 'Time Management'] },
      { id: 'delivery-driver', name: 'Delivery Driver', skills: ['Route Optimization', 'Customer Service', 'Time Management', 'Vehicle Operation', 'GPS Navigation'] },
      { id: 'shipping-coordinator', name: 'Shipping Coordinator', skills: ['Logistics Coordination', 'Documentation', 'Customer Service', 'Problem Solving'] },
      { id: 'freight-broker', name: 'Freight Broker', skills: ['Negotiation', 'Customer Relations', 'Market Knowledge', 'Problem Solving', 'Sales'] }
    ]
  },
  {
    id: 'agriculture-environment',
    name: 'Agriculture & Environment',
    icon: 'leaf',
    color: '#22c55e',
    jobs: [
      { id: 'farmer', name: 'Farmer', skills: ['Crop Management', 'Agricultural Equipment', 'Soil Science', 'Weather Monitoring', 'Business Management'] },
      { id: 'agricultural-engineer', name: 'Agricultural Engineer', skills: ['Farm Equipment Design', 'Irrigation Systems', 'Crop Production', 'Sustainability'] },
      { id: 'veterinary-technician', name: 'Veterinary Technician', skills: ['Animal Care', 'Medical Procedures', 'Laboratory Testing', 'Client Communication'] },
      { id: 'forest-ranger', name: 'Forest Ranger', skills: ['Wildlife Management', 'Conservation', 'Public Education', 'Emergency Response', 'Outdoor Skills'] },
      { id: 'conservation-scientist', name: 'Conservation Scientist', skills: ['Environmental Protection', 'Research', 'Data Collection', 'Policy Development'] },
      { id: 'landscape-architect', name: 'Landscape Architect', skills: ['Landscape Design', 'CAD Software', 'Plant Knowledge', 'Environmental Planning'] },
      { id: 'horticulturist', name: 'Horticulturist', skills: ['Plant Science', 'Garden Design', 'Pest Management', 'Soil Science', 'Plant Breeding'] },
      { id: 'environmental-consultant', name: 'Environmental Consultant', skills: ['Environmental Assessment', 'Regulatory Compliance', 'Report Writing', 'Field Studies'] }
    ]
  },
  {
    id: 'arts-culture',
    name: 'Arts & Culture',
    icon: 'theater',
    color: '#a855f7',
    jobs: [
      { id: 'museum-curator', name: 'Museum Curator', skills: ['Art History', 'Collection Management', 'Exhibition Planning', 'Research', 'Public Engagement'] },
      { id: 'art-teacher', name: 'Art Teacher', skills: ['Art Techniques', 'Curriculum Development', 'Student Instruction', 'Creativity', 'Art History'] },
      { id: 'musician', name: 'Musician', skills: ['Musical Performance', 'Music Theory', 'Instrument Proficiency', 'Composition', 'Stage Presence'] },
      { id: 'music-teacher', name: 'Music Teacher', skills: ['Music Education', 'Instrument Instruction', 'Music Theory', 'Performance', 'Curriculum Development'] },
      { id: 'actor', name: 'Actor', skills: ['Acting Techniques', 'Script Analysis', 'Character Development', 'Stage Presence', 'Memorization'] },
      { id: 'theater-director', name: 'Theater Director', skills: ['Creative Direction', 'Script Analysis', 'Team Leadership', 'Production Management'] },
      { id: 'dancer', name: 'Dancer', skills: ['Dance Techniques', 'Choreography', 'Physical Fitness', 'Performance', 'Rhythm'] },
      { id: 'art-therapist', name: 'Art Therapist', skills: ['Art Therapy Techniques', 'Psychology', 'Counseling', 'Creative Expression', 'Patient Care'] },
      { id: 'gallery-manager', name: 'Gallery Manager', skills: ['Art Curation', 'Business Management', 'Customer Relations', 'Marketing', 'Art Knowledge'] },
      { id: 'cultural-anthropologist', name: 'Cultural Anthropologist', skills: ['Cultural Research', 'Ethnography', 'Data Analysis', 'Writing', 'Cross-cultural Communication'] }
    ]
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    icon: 'dumbbell',
    color: '#f43f5e',
    jobs: [
      { id: 'personal-trainer', name: 'Personal Trainer', skills: ['Exercise Science', 'Fitness Assessment', 'Program Design', 'Motivation', 'Anatomy'] },
      { id: 'athletic-trainer', name: 'Athletic Trainer', skills: ['Sports Medicine', 'Injury Prevention', 'Rehabilitation', 'Emergency Care', 'Exercise Physiology'] },
      { id: 'sports-coach', name: 'Sports Coach', skills: ['Sport-Specific Knowledge', 'Team Leadership', 'Strategy Development', 'Player Development'] },
      { id: 'fitness-instructor', name: 'Fitness Instructor', skills: ['Group Fitness', 'Exercise Techniques', 'Motivation', 'Safety', 'Music Coordination'] },
      { id: 'nutritionist', name: 'Sports Nutritionist', skills: ['Nutrition Science', 'Meal Planning', 'Performance Optimization', 'Client Counseling'] },
      { id: 'physical-education-teacher', name: 'Physical Education Teacher', skills: ['Sports Knowledge', 'Student Instruction', 'Safety Management', 'Curriculum Development'] },
      { id: 'sports-analyst', name: 'Sports Analyst', skills: ['Statistical Analysis', 'Sports Knowledge', 'Data Interpretation', 'Communication', 'Research'] },
      { id: 'recreation-coordinator', name: 'Recreation Coordinator', skills: ['Program Planning', 'Event Management', 'Community Engagement', 'Leadership'] }
    ]
  }
];

export const EXPERIENCE_LEVELS = [
  { id: 'entry', name: 'Entry Level', description: '0-2 years experience', icon: 'sprout' },
  { id: 'junior', name: 'Junior', description: '2-4 years experience', icon: 'tree' },
  { id: 'mid', name: 'Mid-Level', description: '4-7 years experience', icon: 'pine-tree' },
  { id: 'senior', name: 'Senior', description: '7+ years experience', icon: 'forest' },
  { id: 'lead', name: 'Lead/Manager', description: 'Leadership experience', icon: 'account-group' },
];

export const ADDITIONAL_SKILLS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  
  // Web Technologies
  'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Next.js', 'TypeScript',
  
  // Backend Frameworks
  'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'Cassandra',
  
  // Cloud Platforms
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
  
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
  
  // Design Tools
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects',
  
  // Marketing & Analytics
  'Google Analytics', 'Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Content Marketing', 'Email Marketing',
  
  // Business Tools
  'Excel', 'PowerBI', 'Tableau', 'Salesforce', 'HubSpot', 'Slack', 'Jira', 'Confluence',
  
  // Project Management
  'Agile', 'Scrum', 'Kanban', 'Waterfall', 'Risk Management', 'Budgeting',
  
  // Soft Skills
  'Leadership', 'Communication', 'Problem Solving', 'Critical Thinking', 'Teamwork', 'Adaptability'
];

// Flatten all jobs for easy access
export const ALL_CAREER_JOBS = CAREER_CATEGORIES.flatMap(category => 
  category.jobs.map(job => ({ ...job, category: category.name, categoryId: category.id }))
);

// Helper functions
export const getJobById = (jobId) => {
  return ALL_CAREER_JOBS.find(job => job.id === jobId);
};

export const getJobsByCategory = (categoryId) => {
  const category = CAREER_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.jobs : [];
};

export const getCategoryById = (categoryId) => {
  return CAREER_CATEGORIES.find(category => category.id === categoryId);
};

export const getJobsBySkill = (skill) => {
  return ALL_CAREER_JOBS.filter(job => 
    job.skills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
}; 