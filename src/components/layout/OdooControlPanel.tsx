
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Search, Filter, Download, Upload, Settings, 
  List, Grid3X3, Calendar, MoreHorizontal 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OdooControlPanelProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onCreateNew?: () => void;
  viewType?: 'list' | 'kanban' | 'calendar' | 'pivot';
  onViewChange?: (view: string) => void;
  filters?: Array<{ label: string; value: string; count?: number }>;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  actions?: Array<{ label: string; icon?: React.ReactNode; onClick: () => void }>;
  recordCount?: number;
  selectedCount?: number;
}

const OdooControlPanel = ({
  title,
  subtitle,
  searchPlaceholder = "Search...",
  onSearch,
  onCreateNew,
  viewType = 'list',
  onViewChange,
  filters = [],
  selectedFilter,
  onFilterChange,
  actions = [],
  recordCount,
  selectedCount
}: OdooControlPanelProps) => {
  return (
    <div className="bg-white border-b">
      {/* Main Control Panel */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            {onCreateNew && (
              <Button onClick={onCreateNew} className="bg-odoo-primary hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            )}
            
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={action.onClick}
                className="flex items-center"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
            
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {filters.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={selectedFilter} onValueChange={onFilterChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{filter.label}</span>
                          {filter.count !== undefined && (
                            <Badge variant="secondary" className="ml-2">
                              {filter.count}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            {recordCount !== undefined && (
              <span className="text-sm text-gray-600">
                {selectedCount ? `${selectedCount} of ${recordCount}` : `${recordCount} records`}
              </span>
            )}
            
            {onViewChange && (
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('kanban')}
                  className="rounded-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('calendar')}
                  className="rounded-l-none"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdooControlPanel;
