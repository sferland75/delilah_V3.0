#!/bin/bash
npm test -- --config jest.config.js --testPathPattern=EnvironmentalAssessment --silent=false --verbose > test_output.txt 2>&1