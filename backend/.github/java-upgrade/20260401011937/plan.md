

# Upgrade Plan: deploy-guide-api (20260401011937)

- **Generated**: 2026-04-01 01:20
- **HEAD Branch**: main
- **HEAD Commit ID**: 14df73f

## Available Tools



**JDKs**
- JDK 17.0.14: C:\Users\dinhphu\.jdks\corretto-17.0.14\bin (current project JDK, used by step 2)
- JDK 25: **<TO_BE_INSTALLED>** (required by step 1 and final validation)

**Build Tools**
- Maven: **<TO_BE_INSTALLED>** (required by step 1; no Maven installation or wrapper detected)

## Guidelines



- Upgrade Java runtime to the latest LTS version.

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred. 

## Options

- Working branch: appmod/java-upgrade-20260401011937 
- Run tests before and after the upgrade: true 

## Upgrade Goals



- Upgrade Java from 17 to 25 (latest LTS).

### Technology Stack



| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 25 | User requested latest LTS runtime |
| Spring Boot | 3.3.4 | 4.0.5 | Spring Boot 4.0.5 provides documented compatibility up to Java 26 |
| Spring Framework | 6.1.x (managed by Boot 3.3.4) | 7.0.6+ | Spring Boot 4.0.5 requires Spring Framework 7.0.6+ |
| Maven | Not installed | Latest stable | Build cannot run without Maven since no wrapper exists |
| spring-boot-maven-plugin | 3.3.4 (managed) | 4.0.5 | Align plugin to upgraded Spring Boot line |

### Derived Upgrades



- Upgrade Spring Boot parent from 3.3.4 to 4.0.5 to ensure compatibility with Java 25.
- Upgrade Java version property from 17 to 25 to satisfy the requested runtime target.
- Use Maven latest stable release because no Maven binary or wrapper is present in the project.

## Upgrade Steps



- Step 1: Setup Environment
  - **Rationale**: Required toolchain is missing; Java 25 and Maven must be available before any verification.
  - **Changes to Make**:
    - [ ] Install JDK 25
    - [ ] Install Maven latest stable
    - [ ] Verify Java and Maven executables are available
  - **Verification**:
    - Command: `java -version` and `mvn -version`
    - Expected: Java 25 and Maven available

- Step 2: Setup Baseline
  - **Rationale**: Establish baseline compile/test status before changing framework and Java target.
  - **Changes to Make**:
    - [ ] Run baseline test compilation on current code
    - [ ] Run baseline tests on current code
    - [ ] Record compile and test pass rate
  - **Verification**:
    - Command: `mvn clean test-compile -q` and `mvn clean test -q`
    - JDK: C:\Users\dinhphu\.jdks\corretto-17.0.14\bin
    - Expected: Baseline results captured for post-upgrade comparison

- Step 3: Upgrade Runtime and Framework Compatibility
  - **Rationale**: Java 25 target requires framework alignment to a line that supports newer Java versions.
  - **Changes to Make**:
    - [ ] Update `spring-boot-starter-parent` from 3.3.4 to 4.0.5
    - [ ] Update `java.version` from 17 to 25
    - [ ] Resolve any compilation issues caused by managed dependency upgrades
  - **Verification**:
    - Command: `mvn clean test-compile -q`
    - JDK: JDK 25 installed in Step 1
    - Expected: Compilation succeeds for both main and test sources

- Step 4: Final Validation
  - **Rationale**: Confirm all upgrade goals are met and quality gates pass completely.
  - **Changes to Make**:
    - [ ] Confirm target versions in `pom.xml`
    - [ ] Run clean full test suite on Java 25
    - [ ] Fix all remaining test failures until 100% pass
  - **Verification**:
    - Command: `mvn clean test -q`
    - JDK: JDK 25 installed in Step 1
    - Expected: Upgrade goals met and 100% tests pass

## Key Challenges



- **Spring Boot Line Transition (3.3.x to 4.0.x)**
  - **Challenge**: Managed dependency major-version shifts can introduce API/behavior differences.
  - **Strategy**: Keep application code changes minimal, run compile immediately after parent upgrade, then use full tests to catch and fix regressions.
- **Toolchain Availability**
  - **Challenge**: No Maven installation or wrapper is available in the repository.
  - **Strategy**: Install Maven in setup step and run all build/test commands with explicit Java 25 and Maven paths.

