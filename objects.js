// Configuration objects and utility functions for OpenWrt build automation
// This file contains JavaScript objects and functions used for managing OpenWrt build processes

// Define the main build configuration object that contains all necessary settings for OpenWrt compilation
const buildConfig = {
    // Repository configuration object containing source code location details
    repository: {
        // URL string pointing to the Lean's OpenWrt repository (LEDE project fork)
        url: 'https://github.com/coolsnowwolf/lede',
        // Branch name string specifying which git branch to use for the build
        branch: 'master'
    },
    // Target architecture configuration object defining the build target platform
    target: {
        // Architecture string specifying the main CPU architecture (x86 for Intel/AMD)
        arch: 'x86',
        // Sub-architecture string specifying 64-bit variant of x86 architecture
        subarch: '64'
    },
    // Array of package names to be included in the final OpenWrt firmware image
    packages: ['luci', 'kmod-tun', 'openvpn'] // luci: web interface, kmod-tun: TUN/TAP driver, openvpn: VPN client
};

/**
 * Validates the build configuration object to ensure all required fields are present
 * @param {Object} config - The configuration object to validate
 * @returns {boolean} - Returns true if configuration is valid
 * @throws {Error} - Throws an error if required fields are missing
 */
function validateConfig(config) {
    // Check if config object has repository property and repository has url property
    if (!config.repository || !config.repository.url) {
        // Throw error with descriptive message if repository URL is missing
        throw new Error('Repository URL is required');
    }
    // Return true boolean value if all validation checks pass
    return true;
}

/**
 * Generates shell commands for various build actions based on the action type and options
 * @param {string} action - The type of action to perform (update, install, build)
 * @param {Object} options - Optional parameters object (default: empty object)
 * @returns {string|null} - Returns the generated command string or null if action not found
 */
function generateCommand(action, options = {}) {
    // Define object containing mapping of action names to their corresponding shell commands
    const commands = {
        // Command to update all package feeds from their respective repositories
        update: 'scripts/feeds update -a',
        // Command to install all available packages from the updated feeds
        install: 'scripts/feeds install -a',
        // Command to build OpenWrt using make with parallel jobs (uses options.threads or defaults to 1)
        build: `make -j${options.threads || 1}` // Template literal with conditional thread count
    };
    // Return the command string for the requested action, or null if action doesn't exist
    return commands[action] || null;
}

// Define device profiles object containing configuration for different hardware targets
const deviceProfiles = {
    // Configuration object for x86 64-bit architecture devices
    x86_64: {
        // Target string specifying the OpenWrt target format (architecture/subarchitecture)
        target: 'x86/64',
        // Array of filesystem and image format features supported by this target
        features: ['ext4', 'targz'], // ext4: filesystem format, targz: compressed archive format
        // Array of essential package names that are required for basic system operation
        defaultPackages: ['base-files', 'busybox', 'kernel'] // base-files: system files, busybox: utilities, kernel: Linux kernel
    }
};

/**
 * Processes build output to determine success status and extract relevant information
 * @param {string} buildOutput - The raw output string from the build process
 * @returns {Object} - Returns object containing success status, errors array, and artifacts array
 */
function processResults(buildOutput) {
    // Create result object with default values for tracking build outcome
    const results = {
        // Boolean flag indicating whether the build completed successfully (default: false)
        success: false,
        // Array to store error messages encountered during the build process
        errors: [],
        // Array to store paths or information about generated build artifacts
        artifacts: []
    };
    
    // Check if the build output string contains the word 'ERROR' indicating build failure
    if (buildOutput.includes('ERROR')) {
        // Add generic error message to the errors array when ERROR is detected in output
        results.errors.push('Build failed');
    } else {
        // Set success flag to true if no ERROR strings were found in the build output
        results.success = true;
    }
    
    // Return the populated results object containing success status and any errors found
    return results;
}

// Export all functions and objects as a module for use in other JavaScript files
module.exports = {
    // Export the main build configuration object
    buildConfig,
    // Export the configuration validation function
    validateConfig,
    // Export the command generation utility function
    generateCommand,
    // Export the device profiles configuration object
    deviceProfiles,
    // Export the build results processing function
    processResults
};