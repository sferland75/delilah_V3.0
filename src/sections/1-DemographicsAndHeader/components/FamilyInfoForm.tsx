import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Demographics } from '../types';

interface FamilyInfoFormProps {
  control: Control<{ demographics: Demographics }>;
}

export function FamilyInfoForm({ control }: FamilyInfoFormProps) {
  const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: "demographics.children"
  });

  const { fields: householdFields, append: appendHousehold, remove: removeHousehold } = useFieldArray({
    control,
    name: "demographics.householdMembers"
  });

  return (
    <div className="space-y-8">
      {/* Marital Status */}
      <div>
        <h3 className="text-lg font-medium mb-4">Family Information</h3>
        <FormField
          control={control}
          name="demographics.maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="commonLaw">Common Law</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Children */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">Children</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendChild({ name: '', age: undefined, notes: '' })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Button>
        </div>
        <div className="space-y-4">
          {childrenFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-4 items-start">
              <FormField
                control={control}
                name={`demographics.children.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Child's name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`demographics.children.${index}.age`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Age" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChild(index)}
                  className="h-10 w-10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Household Members */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">Household Members</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendHousehold({ name: '', relationship: '', notes: '' })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
        <div className="space-y-4">
          {householdFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-4 items-start">
              <FormField
                control={control}
                name={`demographics.householdMembers.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Member's name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`demographics.householdMembers.${index}.relationship`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Relationship to client" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHousehold(index)}
                  className="h-10 w-10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}