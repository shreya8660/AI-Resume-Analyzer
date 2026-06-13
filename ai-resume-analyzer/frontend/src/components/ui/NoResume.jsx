import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { EmptyState } from './index.jsx';

export default function NoResume() {
  return (
    <EmptyState
      icon={Upload}
      title="No resume uploaded yet"
      description="Upload your resume to start getting AI-powered insights and analysis."
      action={
        <Link to="/upload" className="btn-primary">
          <Upload size={16} /> Upload Resume
        </Link>
      }
    />
  );
}
