
# Bolt

The purpose of this Google Chrome extension is to provide support to pentesters and developers in testing web applications for potential vulnerabilities. With a range of powerful tools and features, the extension aims to enhance the testing process, allowing users to identify and address security weaknesses more efficiently.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Description

My extension stands out for its user-friendly interface, powerful automation capabilities, and comprehensive range of features. It simplifies and accelerates the pentesting process, providing reliable results and empowering pentesters to identify and mitigate security risks efficiently. The combination of information disclosure detection, directory fuzzing, path traversal testing, and customizable methodology sets my extension apart, enabling a comprehensive assessment of web application security. Its uniqueness lies in its ability to seamlessly integrate with the Google Chrome browser, providing a familiar environment for users and enhancing their testing workflow.

## Features


- Informatin disclosure.

    - The information disclosure finder is a key feature of my Google Chrome extension, designed specifically for software engineers and security professionals. This powerful tool enables users to input a website's URL and perform a comprehensive scan, crawling through all the links within the page. Its primary objective is to detect any inadvertent or unauthorized disclosure of sensitive information, including but not limited to API tokens, database credentials, AWS credentials, and cryptocurrency wallets. By leveraging this feature, developers and pentesters can proactively identify potential security vulnerabilities, ensuring that confidential data remains protected and secure

- Directory Fuzzing
    - The "Directory Fuzz" feature enhances your testing capabilities by searching for hidden directories and files within the target web application. Leveraging web scraping techniques, the feature systematically explores the application's structure, utilizing a massive list of known directories collected from the web. By brute-forcing several possible endpoints, it uncovers hidden paths that might contain potential vulnerabilities or sensitive information. The discovered hidden paths are then presented for further investigation and analysis, empowering you to conduct thorough security assessments. With the "Directory Fuzz" feature, you can strengthen your web application testing methodology and proactively identify potential areas of concern.

- Path Transerversal
    - My web application pentesting extension includes a powerful "Path Traversal" feature that aids in testing endpoint vulnerabilities. With this feature, you can conduct targeted attacks on specific endpoints by utilizing various payloads to probe for potential path traversal vulnerabilities. By systematically testing different input combinations, you can identify if the application is susceptible to unauthorized file access or directory traversal attacks.



- Methodology
    - My web application pentesting extension includes a powerful "Methodology" feature that enables users to customize their testing approach. You can create and edit task lists specific to the pentesting process, mark completed tests, and track progress. Additionally, you can add notes and observations for each test, facilitating documentation and collaboration. With this feature, you can ensure a structured and organized methodology for efficient and effective pentesting.

## Installation

To install Bolt, please follow the steps below click [here](https://chrome.google.com/webstore/detail/bolt/nmapdbehmkhagolpgkdbpjldabdagcle):

1. Open your Google Chrome browser.

2. Visit the Chrome Web Store by entering the following URL in your browser's address bar: https://chrome.google.com/webstore/category/extensions

3. In the Chrome Web Store search bar, type the name of my extension "Bolt pentesting tool".

4. From the search results, locate my extension and click on it to open the extension's page.

5. On the extension's page, click on the "Add to Chrome" button.

6. A confirmation dialog box will appear. Click on "Add extension" to proceed with the installation.

7. Chrome will start downloading and installing the extension.

8. Once the installation is complete, you will see a notification confirming that the extension has been added to Chrome.

9. The extension's icon will appear in the Chrome toolbar, indicating that it is ready for use.

Congratulations! You have successfully installed my web application pentesting extension. You can now start leveraging its powerful features to conduct comprehensive security assessments of web applications.

Note: Please ensure that you have the necessary permissions to conduct pentesting activities on the target web applications. Always obtain proper authorization before testing any web application to ensure compliance with legal and ethical standards.

## Usage

- Information disclosure.
    - paste the base url you want the tool to crawl and search for senstive information. 
      _I.e. www.testme.com_
- Directory Fuzzing
    - paste the base url you want the tool to probe for hidden directories. 
      _I.e. www.testme.com_
 - Path transversal 
    - paste the endpoint you believe it might be vulnerabel. _I.e. www.testme.com/images/filename=_
 - Methodology
    - Upon accessing this screen, you will observe that it has been pre-filled with a commonly used methodology. It consists of suggested steps to follow and possible payloads to test for various vulnerabilities such as SQL injection, command injection, and more. Additionally, I have included instructions for your convenience. Feel free to customize and rearrange the content as needed, or if you prefer, you can delete everything and create your own methodology from scratch. The flexibility provided allows you to tailor the methodology according to your specific testing requirements.  

## Contributing

I appreciate your interest in improving my web application pentesting tool. If you have encountered a bug or would like to make suggestions for enhancements, please follow these guidelines:

1. Bug Reporting:
   - Clearly describe the bug you have encountered, including the steps to reproduce it.
   - Provide any error messages or screenshots that could help in understanding and resolving the issue.
   - Specify the version of the extension you are using, as well as the browser and operating system.
   - If possible, share any relevant code snippets or examples that can help in isolating the problem.

2. Suggestions:
   - Clearly articulate your suggestion for enhancing the extension, providing a detailed explanation of the proposed feature or improvement.
   - Consider the feasibility and relevance of the suggestion to the overall purpose and scope of the extension.
   - If applicable, provide any supporting information, such as examples or use cases, that demonstrate the potential benefits of the suggestion.

3. Submitting Bug Reports and Suggestions:
   - Utilize the issue tracking system on my project's GitHub repository to submit bug reports or suggestions.
   - Check the repository's existing issues to ensure that the bug or suggestion hasn't already been reported or suggested.
   - Provide a descriptive title for the bug report or suggestion to facilitate easy identification and categorization.
   - Clearly separate bug reports and suggestions by creating separate issues for each.
   - Engage in any discussions or follow-up questions related to your bug report or suggestion promptly.

I value your feedback and contributions to improving my extension. Your bug reports help me identify and resolve issues, while your suggestions contribute to its evolution and enhancement. Thank you for your support in making my web application pentesting extension even better.

## License

The project is distributed under the [MIT License](https://opensource.org/license/mit/). 

