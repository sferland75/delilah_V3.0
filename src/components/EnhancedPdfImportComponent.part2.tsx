  const renderSuggestionList = () => {
    if (contentSuggestions.length === 0 && validationResults.length === 0 && missingInfo.length === 0) {
      return (
        <Alert className="mb-4">
          <AlertTitle>No suggestions available</AlertTitle>
          <AlertDescription>
            No data enhancement suggestions were found for this document.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Content Suggestions */}
        {contentSuggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Content Suggestions</h3>
            <div className="space-y-3">
              {contentSuggestions.map(suggestion => {
                const isAccepted = acceptedSuggestions.includes(suggestion.id);
                
                return (
                  <div 
                    key={suggestion.id} 
                    className={`p-3 border rounded-md ${highlightedSuggestion === suggestion.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onMouseEnter={() => setHighlightedSuggestion(suggestion.id)}
                    onMouseLeave={() => setHighlightedSuggestion(null)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {availableSections.find(s => s.id === suggestion.section)?.label || suggestion.section}
                          </span>
                          <Badge className="ml-2" variant="outline">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </Badge>
                          <Badge className="ml-2" variant={suggestion.source === 'relationship' ? 'default' : 'secondary'}>
                            {suggestion.source === 'pattern' ? 'Pattern' : 
                             suggestion.source === 'relationship' ? 'Data Relationship' : 'Domain Knowledge'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {suggestion.reason}
                        </p>
                        
                        <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <p className="font-medium text-gray-500">Current Value</p>
                            <p className="text-gray-700">
                              {Array.isArray(suggestion.currentValue) 
                                ? suggestion.currentValue.join(', ') || 'None'
                                : (suggestion.currentValue || 'None')}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Suggested Value</p>
                            <p className="text-gray-700">
                              {Array.isArray(suggestion.suggestedValue) 
                                ? suggestion.suggestedValue.join(', ')
                                : suggestion.suggestedValue}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {isAccepted ? (
                          <Badge className="bg-green-100 text-green-800 h-8">
                            Accepted
                          </Badge>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleRejectSuggestion(suggestion.id)}
                            >
                              Ignore
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptSuggestion(suggestion.id)}
                            >
                              Accept
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Validation Issues */}
        {validationResults.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Data Validation Issues</h3>
            <div className="space-y-3">
              {validationResults.map((validation, index) => {
                const isAccepted = acceptedSuggestions.includes(`${validation.section}-${validation.field}`);
                const severityColor = 
                  validation.severity === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                  validation.severity === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-yellow-700 bg-yellow-50 border-yellow-200';
                
                return (
                  <div 
                    key={`validation-${index}`} 
                    className={`p-3 border rounded-md ${severityColor}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {availableSections.find(s => s.id === validation.section)?.label || validation.section}
                          </span>
                          <Badge className="ml-2" variant={
                            validation.severity === 'high' ? 'destructive' :
                            validation.severity === 'medium' ? 'default' : 'outline'
                          }>
                            {validation.severity} severity
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">
                          {validation.message}
                        </p>
                      </div>
                      
                      {validation.suggestedFix && (
                        <div className="flex space-x-2 ml-4">
                          {isAccepted ? (
                            <Badge className="bg-green-100 text-green-800 h-8">
                              Fix Accepted
                            </Badge>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptSuggestion(`${validation.section}-${validation.field}`)}
                            >
                              Apply Fix
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Missing Information */}
        {missingInfo.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Missing Information</h3>
            <div className="space-y-3">
              {missingInfo.map((missing, index) => {
                const importanceColor = 
                  missing.importance === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                  missing.importance === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-yellow-700 bg-yellow-50 border-yellow-200';
                
                return (
                  <div 
                    key={`missing-${index}`} 
                    className={`p-3 border rounded-md ${importanceColor}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {availableSections.find(s => s.id === missing.section)?.label || missing.section}
                            {missing.field && `: ${missing.field}`}
                          </span>
                          <Badge className="ml-2" variant={
                            missing.importance === 'high' ? 'destructive' :
                            missing.importance === 'medium' ? 'default' : 'outline'
                          }>
                            {missing.importance} importance
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">
                          {missing.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Apply All Suggestions Button */}
        {contentSuggestions.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                const newAccepted = [
                  ...acceptedSuggestions,
                  ...contentSuggestions
                    .filter(s => !acceptedSuggestions.includes(s.id))
                    .map(s => s.id)
                ];
                setAcceptedSuggestions(newAccepted);
                
                toast({
                  title: "All Suggestions Accepted",
                  description: `${newAccepted.length} suggestions will be applied when you import the data.`,
                });
              }}
              disabled={contentSuggestions.every(s => acceptedSuggestions.includes(s.id))}
            >
              Accept All Suggestions
            </Button>
          </div>
        )}
      </div>
    );
  };
