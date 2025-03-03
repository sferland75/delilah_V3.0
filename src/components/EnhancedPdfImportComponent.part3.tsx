  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced PDF Import</CardTitle>
        <CardDescription>
          Import assessment data from PDF documents with intelligent suggestions and validation.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {!extractedData ? (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label 
                  htmlFor="pdf-upload" 
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Click to select a PDF file
                </Label>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Processing PDF... This may take a moment.
                  </p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleProcessPdf} 
                  disabled={!file || isProcessing}
                  className="w-40"
                >
                  Process PDF
                </Button>
              </div>
            </>
          ) : (
            <>
              <Alert className="bg-blue-50 text-blue-800 border-blue-200 mb-4">
                <AlertTitle>PDF Processed Successfully</AlertTitle>
                <AlertDescription>
                  <p>Data has been extracted from your document. Review the suggestions and select sections to import.</p>
                  {(contentSuggestions.length > 0 || validationResults.length > 0) && (
                    <p className="mt-1">
                      <strong>{contentSuggestions.length}</strong> content suggestions and <strong>{validationResults.length}</strong> validation issues were identified.
                    </p>
                  )}
                </AlertDescription>
              </Alert>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="sections">
                    Sections
                  </TabsTrigger>
                  <TabsTrigger value="suggestions">
                    Suggestions
                    {(contentSuggestions.length > 0 || validationResults.length > 0) && (
                      <Badge className="ml-2" variant="secondary">
                        {contentSuggestions.length + validationResults.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="missing">
                    Missing Data
                    {missingInfo.length > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {missingInfo.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sections" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Select Sections to Import</h3>
                    <Button 
                      variant="link" 
                      className="h-auto p-0"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? 'Hide details' : 'Show details'}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {availableSections.map(section => {
                      // Check if we have data for this section
                      const hasData = extractedData && extractedData[section.key];
                      const sectionId = section.id.toUpperCase();
                      const confidence = confidenceScores[sectionId] || 0;
                      
                      return (
                        <div key={section.id} className={`p-3 rounded-md ${hasData ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
                          <div className="flex items-center">
                            <Checkbox
                              id={`section-${section.id}`}
                              checked={selectedSections.includes(section.id)}
                              onCheckedChange={() => handleSectionToggle(section.id)}
                              disabled={!hasData}
                            />
                            <Label
                              htmlFor={`section-${section.id}`}
                              className="ml-2 font-medium cursor-pointer"
                            >
                              {section.label}
                              {hasData && renderConfidenceBadge(sectionId)}
                            </Label>
                          </div>
                          
                          {!hasData && (
                            <p className="mt-1 ml-6 text-sm text-gray-500">
                              No data detected for this section
                            </p>
                          )}
                          
                          {hasData && showDetails && renderSectionPreview(section.id)}
                          
                          {hasData && confidence < 0.6 && (
                            <p className="mt-1 ml-6 text-sm text-yellow-600">
                              <span className="font-medium">⚠️ Low confidence:</span> This section may require manual review and editing.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="suggestions">
                  {renderSuggestionList()}
                </TabsContent>
                
                <TabsContent value="missing">
                  {missingInfo.length === 0 ? (
                    <Alert>
                      <AlertTitle>No missing critical data</AlertTitle>
                      <AlertDescription>
                        All required data appears to be present in the extracted assessment.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                        <AlertTitle>Missing Information Detected</AlertTitle>
                        <AlertDescription>
                          {missingInfo.length} items of important information are missing from the extracted data.
                          You can complete these fields after importing or choose different sections.
                        </AlertDescription>
                      </Alert>
                      
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
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {extractedData ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setExtractedData(null);
                setSelectedSections([]);
                setProgress(0);
                setShowDetails(false);
                setValidationResults([]);
                setContentSuggestions([]);
                setMissingInfo([]);
                setAcceptedSuggestions([]);
              }}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleImportData}
              disabled={selectedSections.length === 0}
              className="w-40"
            >
              Import Selected
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="ml-auto"
          >
            Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
