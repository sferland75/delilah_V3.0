import { BaseAgent } from '@/narrative/agents/BaseAgent';
import { AgentContext, ReportSection, ReportSectionType } from '@/types/report';
import { Assessment } from '@/types/assessment';
import { Demographics, ProcessedDemographics } from './types';

export class DemographicsAgent extends BaseAgent {
  constructor(context: AgentContext) {
    super(context);
    this.priority = 1;
    this.name = 'DemographicsAgent';
    this.dataKeys = ['demographics'];
  }

  async processData(data: Assessment): Promise<ProcessedDemographics> {
    const demographics = data.demographics as Demographics;
    const birthDate = new Date(demographics.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    return {
      valid: true,
      fullName: `${demographics.firstName} ${demographics.lastName}`,
      age,
      contact: {
        phone: demographics.phone,
        email: demographics.email,
        address: demographics.address
      },
      insurance: {
        provider: demographics.insuranceProvider,
        claimNumber: demographics.claimNumber,
        adjustor: {
          name: demographics.adjustorName,
          phone: demographics.adjustorPhone
        }
      },
      legal: {
        representative: demographics.legalRepName,
        firm: demographics.legalFirm,
        fileNumber: demographics.fileNumber
      },
      family: {
        maritalStatus: demographics.maritalStatus,
        children: demographics.children,
        householdMembers: demographics.householdMembers
      }
    };
  }

  protected formatBrief(data: ProcessedDemographics): string {
    return `${data.fullName} is a ${data.age}-year-old individual. The assessment was requested by ${data.legal.firm || 'their legal representative'} (File #${data.legal.fileNumber || 'not provided'}).`;
  }

  protected formatStandard(data: ProcessedDemographics): string {
    const sections = [
      this.formatBrief(data),
      '\nContact Information:',
      `Phone: ${data.contact.phone || 'Not provided'}`,
      `Email: ${data.contact.email || 'Not provided'}`,
      `Address: ${data.contact.address || 'Not provided'}`,
      '\nInsurance Details:',
      `Provider: ${data.insurance.provider || 'Not provided'}`,
      `Claim Number: ${data.insurance.claimNumber || 'Not provided'}`,
      `Adjustor: ${data.insurance.adjustor.name || 'Not provided'}`,
      '\nLegal Representation:',
      `Representative: ${data.legal.representative || 'Not provided'}`,
      `Firm: ${data.legal.firm || 'Not provided'}`,
      `File Number: ${data.legal.fileNumber || 'Not provided'}`
    ];

    return sections.join('\n');
  }

  protected formatDetailed(data: ProcessedDemographics): string {
    const sections = [
      this.formatStandard(data),
      '\nFamily Information:',
      `Marital Status: ${this.formatMaritalStatus(data.family.maritalStatus)}`,
    ];

    if (data.family.children?.length) {
      sections.push(
        '\nChildren:',
        ...data.family.children.map(child => 
          `- ${child.name}${child.age ? ` (${child.age} years)` : ''}${child.notes ? `: ${child.notes}` : ''}`
        )
      );
    }

    if (data.family.householdMembers?.length) {
      sections.push(
        '\nHousehold Members:',
        ...data.family.householdMembers.map(member => 
          `- ${member.name} (${member.relationship})${member.notes ? `: ${member.notes}` : ''}`
        )
      );
    }

    return sections.join('\n');
  }

  async generateSection(data: Assessment): Promise<ReportSection> {
    const processedData = await this.processData(data);
    const content = await this.getFormattedContent(
      processedData,
      this.context.config.detailLevel
    );

    return {
      title: 'Demographics & Header',
      type: ReportSectionType.STRUCTURED,
      orderNumber: this.priority,
      content
    };
  }

  private formatMaritalStatus(status: string | undefined): string {
    if (!status) return 'Not provided';
    
    const statusMap: Record<string, string> = {
      'married': 'Married',
      'single': 'Single',
      'divorced': 'Divorced',
      'widowed': 'Widowed',
      'commonLaw': 'Common Law',
      'separated': 'Separated'
    };
    return statusMap[status] || status;
  }
}