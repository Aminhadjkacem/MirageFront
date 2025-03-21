// src/components/comptability/QuotationSearchFilter.tsx
import { useState, useMemo } from 'react';
import { Quotation } from '../../../api/quotationApi';
import { useEffect } from 'react';
interface QuotationSearchFilterProps {
  devis: Quotation[];
  onFilterChange: (filteredDevis: Quotation[]) => void;
}

export function QuotationSearchFilter({ devis, onFilterChange }: QuotationSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Get unique project names for the filter dropdown
  const projectOptions = useMemo(() => {
    const projects = Array.from(new Set(devis.map(item => item.ProjectName)));
    return ['All Projects', ...projects]; // Include "All Projects" as the default/reset option
  }, [devis]);

  // Handle search and filter logic
  const filteredDevis = useMemo(() => {
    let result = [...devis];

    // Search by client name, project name, or designation
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        const clientName =
          item.CustomerType === 'NORMAL'
            ? item.CustomerDetails.FullName?.toLowerCase() || ''
            : item.CustomerDetails.CompanyName?.toLowerCase() || '';
        const projectName = item.ProjectName.toLowerCase();
        const designations = item.Designations.map(d => d.Name.toLowerCase()).join(' ');
        return (
          clientName.includes(query) ||
          projectName.includes(query) ||
          designations.includes(query)
        );
      });
    }

    // Filter by project name
    if (selectedProject && selectedProject !== 'All Projects') {
      result = result.filter(item => item.ProjectName === selectedProject);
    }

    return result;
  }, [devis, searchQuery, selectedProject]);

  // Update parent component with filtered results whenever they change
  useEffect(() => {
    onFilterChange(filteredDevis);
  }, [filteredDevis, onFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client, project, or designation..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Project Filter Dropdown */}
      <div className="w-full sm:w-64">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {projectOptions.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}