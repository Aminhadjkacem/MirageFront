// src/components/comptability/InvoiceSearchFilter.tsx
import { useState, useMemo, useEffect } from 'react';
import { Quotation, QuotationStatus } from '../../../api/quotationApi';

interface InvoiceSearchFilterProps {
  devis: Quotation[];
  onFilterChange: (filteredDevis: Quotation[]) => void;
}

export function InvoiceSearchFilter({ devis, onFilterChange }: InvoiceSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Filter only validated quotations and get unique project names
  const projectOptions = useMemo(() => {
    // Filter devis to include only those with "APPROVED" (VALIDATED) status
    const validatedDevis = devis.filter(item => item.Status === QuotationStatus.APPROVED);
    const projects = Array.from(new Set(validatedDevis.map(item => item.ProjectName)));
    return ['Tous les projets', ...projects]; // Include "Tous les projets" as the default/reset option
  }, [devis]);

  // Handle search and filter logic, starting with only validated quotations
  const filteredDevis = useMemo(() => {
    // Start with only validated quotations
    let result = devis.filter(item => item.Status === QuotationStatus.APPROVED);

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
    if (selectedProject && selectedProject !== 'Tous les projets') {
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
          placeholder="Rechercher par client, projet ou désignation..."
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