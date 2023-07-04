import {
  expectConsoleLogToHaveBeenCalledWith,
  spyOnConsoleLog,
} from '../support/console-spy';
import { clickShowMore, getFieldByName } from '../support/get-elements';
import { visitGenerateUi } from '../support/visit-generate-ui';
import { GeneratorSchema } from '@nx-console/shared/generate-ui-types';

const schemaProj: GeneratorSchema = {
  collectionName: '@nx/test',
  generatorName: 'test',
  description: 'description',
  options: [
    {
      name: 'project',
      isRequired: true,
      aliases: [],
      items: ['project1', 'project2', 'project3'],
    },
  ],
  context: {
    project: 'project3',
    directory: 'nested/nested2',
  },
};
const schemaDir: GeneratorSchema = {
  collectionName: '@nx/test',
  generatorName: 'test',
  description: 'description',
  options: [{ name: 'directory', isRequired: false, aliases: [] }],
  context: {
    project: 'project3',
    directory: 'nested/nested2',
  },
};

const schemaBoth: GeneratorSchema = {
  collectionName: '@nx/test',
  generatorName: 'test',
  description: 'description',
  options: [
    {
      name: 'project',
      isRequired: true,
      aliases: [],
      items: ['project1', 'project2', 'project3'],
    },
    { name: 'directory', isRequired: false, aliases: [] },
  ],
  context: {
    project: 'project3',
    directory: 'nested/nested2',
  },
};
describe('generator context', () => {
  it('should correctly use the context to autofill project', () => {
    visitGenerateUi(schemaProj);
    getFieldByName('project').should('have.value', 'project3');

    spyOnConsoleLog().then((consoleLog) => {
      cy.get("[data-cy='generate-button']").click();
      expectConsoleLogToHaveBeenCalledWith(consoleLog, 'run-generator');
      expectConsoleLogToHaveBeenCalledWith(consoleLog, '--project=project3');
    });
  });

  it('should correctly use the context to autofill directory', () => {
    visitGenerateUi(schemaDir);

    getFieldByName('directory').should('have.value', 'nested/nested2');

    spyOnConsoleLog().then((consoleLog) => {
      cy.get("[data-cy='generate-button']").click();
      expectConsoleLogToHaveBeenCalledWith(consoleLog, 'run-generator');
      expectConsoleLogToHaveBeenCalledWith(
        consoleLog,
        '--directory=nested/nested2'
      );
    });
  });

  it('should only fill project if both directory and project exist', () => {
    visitGenerateUi(schemaBoth);
    clickShowMore();

    getFieldByName('project').should('have.value', 'project3');
    getFieldByName('directory').should('be.empty');

    spyOnConsoleLog().then((consoleLog) => {
      cy.get("[data-cy='generate-button']").click();
      expectConsoleLogToHaveBeenCalledWith(consoleLog, 'run-generator');
      expectConsoleLogToHaveBeenCalledWith(consoleLog, '--project=project3');
    });
  });
});