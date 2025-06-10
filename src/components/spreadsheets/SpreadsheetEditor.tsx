
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spreadsheet, SpreadsheetCell, SpreadsheetCollaborator } from '@/types/spreadsheets';
import { 
  Grid, Save, Share2, Download, Undo, Redo, 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Palette, Grid3X3, Filter, SortAsc, BarChart3,
  Users, Lock, Unlock, Plus, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface SpreadsheetEditorProps {
  spreadsheet: Spreadsheet;
  onSave: (spreadsheet: Spreadsheet) => void;
  onShare: () => void;
  currentUserId: string;
}

const SpreadsheetEditor = ({ spreadsheet, onSave, onShare, currentUserId }: SpreadsheetEditorProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [formula, setFormula] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSheet, setActiveSheet] = useState(0);

  const currentSheet = spreadsheet.sheets[activeSheet];
  const onlineCollaborators = spreadsheet.collaborators.filter(c => c.isOnline);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const cellKey = `${row},${col}`;
    const cell = currentSheet?.cells[cellKey];
    setFormula(cell?.formula || cell?.value?.toString() || '');
    setIsEditMode(false);
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setIsEditMode(true);
  };

  const handleFormulaChange = (value: string) => {
    setFormula(value);
  };

  const handleCellUpdate = useCallback(() => {
    if (!selectedCell || !currentSheet) return;

    const cellKey = `${selectedCell.row},${selectedCell.col}`;
    const updatedSheet = {
      ...currentSheet,
      cells: {
        ...currentSheet.cells,
        [cellKey]: {
          row: selectedCell.row,
          column: selectedCell.col,
          value: formula.startsWith('=') ? null : formula,
          formula: formula.startsWith('=') ? formula : undefined,
          type: formula.startsWith('=') ? 'formula' : typeof formula === 'number' ? 'number' : 'text',
          lastModified: new Date().toISOString(),
          modifiedBy: currentUserId
        } as SpreadsheetCell
      }
    };

    const updatedSpreadsheet = {
      ...spreadsheet,
      sheets: spreadsheet.sheets.map((sheet, index) => 
        index === activeSheet ? updatedSheet : sheet
      ),
      lastModified: new Date().toISOString()
    };

    onSave(updatedSpreadsheet);
    setIsEditMode(false);
    
    toast({
      title: "Cell Updated",
      description: `Cell ${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1} has been updated.`,
    });
  }, [selectedCell, formula, currentSheet, spreadsheet, activeSheet, onSave, currentUserId]);

  const getCellValue = (row: number, col: number) => {
    const cellKey = `${row},${col}`;
    const cell = currentSheet?.cells[cellKey];
    return cell?.value?.toString() || '';
  };

  const getCellStyle = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    return `
      border border-gray-300 p-1 min-h-[32px] min-w-[80px] text-sm
      ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}
      ${row === 0 ? 'bg-gray-100 font-medium' : ''}
      ${col === 0 ? 'bg-gray-100 font-medium' : ''}
    `;
  };

  const renderGrid = () => {
    const rows = Array.from({ length: currentSheet?.rowCount || 20 }, (_, i) => i);
    const cols = Array.from({ length: currentSheet?.columnCount || 10 }, (_, i) => i);

    return (
      <div className="overflow-auto max-h-[600px] border rounded">
        <table className="border-collapse">
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                {cols.map(col => (
                  <td
                    key={`${row}-${col}`}
                    className={getCellStyle(row, col)}
                    onClick={() => handleCellClick(row, col)}
                    onDoubleClick={() => handleCellDoubleClick(row, col)}
                  >
                    {row === 0 && col === 0 ? (
                      <div className="w-4 h-4" />
                    ) : row === 0 ? (
                      String.fromCharCode(64 + col)
                    ) : col === 0 ? (
                      row
                    ) : isEditMode && selectedCell?.row === row && selectedCell?.col === col ? (
                      <Input
                        value={formula}
                        onChange={(e) => handleFormulaChange(e.target.value)}
                        onBlur={handleCellUpdate}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellUpdate();
                          } else if (e.key === 'Escape') {
                            setIsEditMode(false);
                          }
                        }}
                        className="border-0 p-0 h-auto min-h-[24px] text-xs"
                        autoFocus
                      />
                    ) : (
                      getCellValue(row, col)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with collaborators */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5 text-green-600" />
              {spreadsheet.name}
              {spreadsheet.isLocked && (
                <Badge variant="outline" className="bg-yellow-100">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {onlineCollaborators.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div className="flex -space-x-2">
                    {onlineCollaborators.slice(0, 3).map((collaborator, index) => (
                      <div
                        key={collaborator.userId}
                        className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                        title={collaborator.name}
                      >
                        {collaborator.name.charAt(0)}
                      </div>
                    ))}
                    {onlineCollaborators.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center border-2 border-white">
                        +{onlineCollaborators.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <Button size="sm" variant="outline" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" onClick={() => onSave(spreadsheet)}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Toolbar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 border-r pr-2">
              <Button size="sm" variant="outline">
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-1 border-r pr-2">
              <Button size="sm" variant="outline">
                <Bold className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Italic className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2">
              <Button size="sm" variant="outline">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2">
              <Button size="sm" variant="outline">
                <Palette className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <SortAsc className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formula bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium min-w-[60px]">
              {selectedCell ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}` : 'A1'}
            </span>
            <Input
              value={formula}
              onChange={(e) => handleFormulaChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCellUpdate();
                }
              }}
              placeholder="Enter formula or value..."
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sheet tabs */}
      <div className="flex items-center gap-1 bg-gray-50 p-2 rounded">
        {spreadsheet.sheets.map((sheet, index) => (
          <Button
            key={sheet.id}
            size="sm"
            variant={index === activeSheet ? "default" : "ghost"}
            onClick={() => setActiveSheet(index)}
            className="h-8"
          >
            {sheet.name}
            {sheet.isProtected && <Lock className="h-3 w-3 ml-1" />}
          </Button>
        ))}
        <Button size="sm" variant="ghost" className="h-8">
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Grid */}
      <Card>
        <CardContent className="p-0">
          {renderGrid()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpreadsheetEditor;
