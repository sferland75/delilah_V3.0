
          >
            Back to Preview
          </Button>
        </div>
      </div>
    );
  }

  if (!generatedReport) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
        <h3 className="font-medium">No report to export</h3>
        <p className="text-sm mt-1">Please generate a report first.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={goToPreviousStep}
        >
          Back to Preview
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Finalize & Export Report</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Your report is ready to be finalized and exported. Choose your preferred format and options.
      </p>
      
      {!exportComplete ? (
        <>
          <Tabs value={exportTab} onValueChange={setExportTab} className="w-full border rounded-md">
            <TabsList className="grid w-full grid-cols-3 p-0 h-auto border-b">
              <TabsTrigger 
                value="export" 
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Export File
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Share via Email
              </TabsTrigger>
              <TabsTrigger 
                value="print" 
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Print Report
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="p-6">
              <div className="mb-6">
                <Label htmlFor="filename" className="text-base font-medium block mb-2">Report Filename</Label>
                <Input 
                  id="filename" 
                  value={filename} 
                  onChange={(e) => setFilename(e.target.value)} 
                  className="max-w-md"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card 
                  className={`cursor-pointer transition-all ${exportFormat === "pdf" ? "border-2 border-blue-600" : ""}`}
                  onClick={() => setExportFormat("pdf")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-center mb-2">
                      {getFormatIcon("pdf")}
                    </div>
                    <CardTitle className="text-center">PDF Document</CardTitle>
                    <CardDescription className="text-center">Standard format for sharing and printing</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <div className="flex justify-center">
                      <RadioGroupItem value="pdf" checked={exportFormat === "pdf"} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all ${exportFormat === "docx" ? "border-2 border-blue-600" : ""}`}
                  onClick={() => setExportFormat("docx")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-center mb-2">
                      {getFormatIcon("docx")}
                    </div>
                    <CardTitle className="text-center">Word Document</CardTitle>
                    <CardDescription className="text-center">Editable format for further modifications</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <div className="flex justify-center">
                      <RadioGroupItem value="docx" checked={exportFormat === "docx"} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all ${exportFormat === "clientRecord" ? "border-2 border-blue-600" : ""}`}
                  onClick={() => setExportFormat("clientRecord")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-center mb-2">
                      {getFormatIcon("clientRecord")}
                    </div>
                    <CardTitle className="text-center">Client Record</CardTitle>
                    <CardDescription className="text-center">Save directly to the client's electronic record</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <div className="flex justify-center">
                      <RadioGroupItem value="clientRecord" checked={exportFormat === "clientRecord"} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Accordion type="single" collapsible className="mb-6">
                <AccordionItem value="advanced-options">
                  <AccordionTrigger className="text-sm font-medium">
                    Advanced Options
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Document Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeCoverPage" 
                              checked={advancedOptions.includeCoverPage} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeCoverPage', Boolean(checked))
                              }
                            />
                            <Label htmlFor="includeCoverPage">Include Cover Page</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeTableOfContents" 
                              checked={advancedOptions.includeTableOfContents} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeTableOfContents', Boolean(checked))
                              }
                            />
                            <Label htmlFor="includeTableOfContents">Include Table of Contents</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeSignatureLine" 
                              checked={advancedOptions.includeSignatureLine} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeSignatureLine', Boolean(checked))
                              }
                            />
                            <Label htmlFor="includeSignatureLine">Include Signature Line</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeMetadata" 
                              checked={advancedOptions.includeMetadata} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeMetadata', Boolean(checked))
                              }
                            />
                            <Label htmlFor="includeMetadata">Include Metadata</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeHeaders" 
                              checked={advancedOptions.includeHeaders} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeHeaders', Boolean(checked))
                              }
                            />
                            <Label htmlFor="includeHeaders">Include Headers</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="includeFooters" 
                              checked={advancedOptions.includeFooters} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeFooters', Boolean(checked))
                              }
                            />
                            <Label htmlFor="includeFooters">Include Footers</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Page Setup</h4>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="pageSize" className="block mb-1">Page Size</Label>
                            <Select 
                              value={advancedOptions.pageSize} 
                              onValueChange={(value) => handleAdvancedOptionChange('pageSize', value)}
                            >
                              <SelectTrigger id="pageSize" className="w-full">
                                <SelectValue placeholder="Select page size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="letter">Letter</SelectItem>
                                <SelectItem value="a4">A4</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="orientation" className="block mb-1">Orientation</Label>
                            <Select 
                              value={advancedOptions.orientation} 
                              onValueChange={(value) => handleAdvancedOptionChange('orientation', value)}
                            >
                              <SelectTrigger id="orientation" className="w-full">
                                <SelectValue placeholder="Select orientation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="landscape">Landscape</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="useBranding" 
                              checked={advancedOptions.useBranding} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('useBranding', Boolean(checked))
                              }
                            />
                            <Label htmlFor="useBranding">Use Organization Branding</Label>
                          </div>
                          
                          {advancedOptions.useBranding && (
                            <div>
                              <Label htmlFor="organizationName" className="block mb-1">Organization Name</Label>
                              <Input 
                                id="organizationName" 
                                value={advancedOptions.organizationName || ''} 
                                onChange={(e) => handleAdvancedOptionChange('organizationName', e.target.value)} 
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="border rounded-md p-6 mb-6">
                <h4 className="text-base font-medium mb-3">Report Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-32 font-medium">Title:</span>
                    <span>{generatedReport.title}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Sections:</span>
                    <span>{generatedReport.sections.length}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Created Date:</span>
                    <span>{new Date(generatedReport.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Format:</span>
                    <span>
                      {exportFormat === "pdf" ? "PDF Document" : 
                       exportFormat === "docx" ? "Word Document" : 
                       "Client Record Entry"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">File Name:</span>
                    <span>
                      {filename || `${generatedReport.title.replace(/\s+/g, '_')}`}
                      {exportFormat === "pdf" ? ".pdf" : 
                       exportFormat === "docx" ? ".docx" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline"
                  onClick={goToPreviousStep} 
                  disabled={isExporting}
                >
                  Back
                </Button>
                
                <Button 
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="flex items-center"
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Export Report
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="p-6">
              <div className="mb-6">
                <Label htmlFor="emailRecipients" className="text-base font-medium block mb-2">
                  Email Recipients
                </Label>
                <Input
                  id="emailRecipients" 
                  value={emailRecipients} 
                  onChange={(e) => setEmailRecipients(e.target.value)} 
                  className="max-w-md"
                  placeholder="Enter email addresses separated by commas"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add multiple recipients by separating email addresses with commas.
                </p>
              </div>
              
              <div className="mb-6">
                <Label className="text-base font-medium block mb-2">
                  Attachment Format
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroup 
                      value={advancedOptions.emailAttachFormat} 
                      onValueChange={(value) => handleAdvancedOptionChange('emailAttachFormat', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="attach-pdf" />
                        <Label htmlFor="attach-pdf">PDF Document</Label>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="docx" id="attach-docx" />
                        <Label htmlFor="attach-docx">Word Document</Label>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="both" id="attach-both" />
                        <Label htmlFor="attach-both">Both Formats</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="mb-6">
                <AccordionItem value="email-advanced-options">
                  <AccordionTrigger className="text-sm font-medium">
                    Document Options
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Document Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="email-includeCoverPage" 
                              checked={advancedOptions.includeCoverPage} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeCoverPage', Boolean(checked))
                              }
                            />
                            <Label htmlFor="email-includeCoverPage">Include Cover Page</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="email-includeTableOfContents" 
                              checked={advancedOptions.includeTableOfContents} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeTableOfContents', Boolean(checked))
                              }
                            />
                            <Label htmlFor="email-includeTableOfContents">Include Table of Contents</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="email-includeSignatureLine" 
                              checked={advancedOptions.includeSignatureLine} 
                              onCheckedChange={(checked) => 
                                handleAdvancedOptionChange('includeSignatureLine', Boolean(checked))
                              }
                            />
                            <Label htmlFor="email-includeSignatureLine">Include Signature Line</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Page Setup</h4>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email-pageSize" className="block mb-1">Page Size</Label>
                            <Select 
                              value={advancedOptions.pageSize} 
                              onValueChange={(value) => handleAdvancedOptionChange('pageSize', value)}
                            >
                              <SelectTrigger id="email-pageSize" className="w-full">
                                <SelectValue placeholder="Select page size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="letter">Letter</SelectItem>
                                <SelectItem value="a4">A4</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="email-orientation" className="block mb-1">Orientation</Label>
                            <Select 
                              value={advancedOptions.orientation} 
                              onValueChange={(value) => handleAdvancedOptionChange('orientation', value)}
                            >
                              <SelectTrigger id="email-orientation" className="w-full">
                                <SelectValue placeholder="Select orientation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="landscape">Landscape</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="border rounded-md p-6 mb-6">
                <h4 className="text-base font-medium mb-3">Email Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-32 font-medium">Report Title:</span>
                    <span>{generatedReport.title}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Recipients:</span>
                    <span>
                      {emailRecipients ? 
                        emailRecipients.split(',').map(email => email.trim()).join(', ') : 
                        'No recipients specified'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Format:</span>
                    <span>
                      {advancedOptions.emailAttachFormat === "pdf" ? "PDF Document" : 
                       advancedOptions.emailAttachFormat === "docx" ? "Word Document" : 
                       "Both PDF and Word Document"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline"
                  onClick={goToPreviousStep} 
                  disabled={isExporting}
                >
                  Back
                </Button>
                
                <Button 
                  onClick={handleEmailShare} 
                  disabled={isExporting || !emailRecipients}
                  className="flex items-center"
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Share via Email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="print" className="p-6">
              <div className="mb-6">
                <h4 className="text-base font-medium mb-2">Print Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="print-pageSize" className="block mb-1">Page Size</Label>
                    <Select 
                      value={advancedOptions.pageSize} 
                      onValueChange={(value) => handleAdvancedOptionChange('pageSize', value)}
                    >
                      <SelectTrigger id="print-pageSize" className="w-full">
                        <SelectValue placeholder="Select page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="print-orientation" className="block mb-1">Orientation</Label>
                    <Select 
                      value={advancedOptions.orientation} 
                      onValueChange={(value) => handleAdvancedOptionChange('orientation', value)}
                    >
                      <SelectTrigger id="print-orientation" className="w-full">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="print-includeHeaders" 
                    checked={advancedOptions.includeHeaders} 
                    onCheckedChange={(checked) => 
                      handleAdvancedOptionChange('includeHeaders', Boolean(checked))
                    }
                  />
                  <Label htmlFor="print-includeHeaders">Include Headers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="print-includeFooters" 
                    checked={advancedOptions.includeFooters} 
                    onCheckedChange={(checked) => 
                      handleAdvancedOptionChange('includeFooters', Boolean(checked))
                    }
                  />
                  <Label htmlFor="print-includeFooters">Include Footers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="print-includeCoverPage" 
                    checked={advancedOptions.includeCoverPage} 
                    onCheckedChange={(checked) => 
                      handleAdvancedOptionChange('includeCoverPage', Boolean(checked))
                    }
                  />
                  <Label htmlFor="print-includeCoverPage">Include Cover Page</Label>
                </div>
              </div>
              
              <div className="border rounded-md p-6 mb-6">
                <h4 className="text-base font-medium mb-3">Print Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-32 font-medium">Report Title:</span>
                    <span>{generatedReport.title}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Page Size:</span>
                    <span>{advancedOptions.pageSize?.toUpperCase()}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Orientation:</span>
                    <span>{advancedOptions.orientation}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Headers:</span>
                    <span>{advancedOptions.includeHeaders ? 'Included' : 'Not included'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 font-medium">Footers:</span>
                    <span>{advancedOptions.includeFooters ? 'Included' : 'Not included'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline"
                  onClick={goToPreviousStep} 
                  disabled={isExporting}
                >
                  Back
                </Button>
                
                <Button 
                  onClick={handlePrint} 
                  disabled={isExporting}
                  className="flex items-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="border rounded-md p-8 mb-6 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            exportSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
            {exportSuccess ? (
              <Check className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">{exportSuccess ? "Export Complete" : "Export Failed"}</h3>
          <p className="text-muted-foreground mb-6">{exportMessage}</p>
          {exportSuccess && (
            <div className="flex justify-center space-x-4">
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setExportComplete(false)}
              >
                Export Another Format
              </Button>
            </div>
          )}
          {!exportSuccess && (
            <Button 
              variant="outline" 
              onClick={() => setExportComplete(false)}
            >
              Try Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
