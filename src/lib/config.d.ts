 import {Agent as httpsAgent} from 'https';
 import {AWSError} from './error';
 import {Credentials, CredentialsOptions} from './credentials';
import { CredentialProviderChain } from './credentials/credential_provider_chain';
 import {ConfigurationServicePlaceholders, ConfigurationServiceApiVersions} from './config_service_placeholders';

 export class ConfigBase extends ConfigurationOptions{

     credentials?: Credentials|CredentialsOptions
     /**
     * The provider chain used to resolve credentials if no static credentials property is set.
    */
   credentialProvider?: CredentialProviderChain
    /**
      * AWS access key ID.
      *
      * @deprecated
      * 
    **/
 }