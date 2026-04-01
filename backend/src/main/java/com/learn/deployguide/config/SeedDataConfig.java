package com.learn.deployguide.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.learn.deployguide.model.StackGuide;
import com.learn.deployguide.model.StepGuide;
import com.learn.deployguide.repository.StackRepository;
import com.learn.deployguide.repository.StepRepository;

@Configuration
public class SeedDataConfig {

    @Bean
    public CommandLineRunner seedData(
            StackRepository stackRepository,
            StepRepository stepRepository,
            @Value("${app.seed.enabled:false}") boolean seedEnabled) {
        return args -> {
            if (!seedEnabled || stackRepository.count() > 0) {
                return;
            }

            StackGuide stack = stackRepository.save(new StackGuide(
                    "react-springboot",
                    "React + Spring Boot",
                    "Deploy React on Vercel, Spring Boot on Render, MongoDB Atlas as cloud DB.",
                    1));

            StackGuide optionalStack = stackRepository.save(new StackGuide(
                    "react-node",
                    "React + Node.js",
                    "Optional path: deploy React frontend and Node backend for comparison.",
                    2));

            List<StepGuide> steps = List.of(
                    new StepGuide(
                            stack.getId(),
                            1,
                            "Create Spring Boot backend",
                            "Generate a Spring Boot app with Web and MongoDB dependencies.",
                            List.of(
                                    "mvn -v",
                                    "mvn spring-boot:run"),
                            "/images/backend-setup.svg"
                    ),
                    new StepGuide(
                            stack.getId(),
                            2,
                            "Configure MongoDB Atlas",
                            "Create a cluster, database user, and copy connection string to Render env vars.",
                            List.of(
                                    "MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"),
                            "/images/mongodb-atlas.svg"
                    ),
                    new StepGuide(
                            stack.getId(),
                            3,
                            "Deploy backend to Render",
                            "Push backend code, create Render Web Service, set build and start commands.",
                            List.of(
                                    "Build: mvn clean package -DskipTests",
                                    "Start: java -Dserver.port=$PORT -jar target/deploy-guide-api-0.0.1-SNAPSHOT.jar"),
                            "/images/render-deploy.svg"
                    ),
                    new StepGuide(
                            stack.getId(),
                            4,
                            "Deploy frontend to Vercel",
                            "Set VITE_API_BASE_URL to Render API URL and deploy React app.",
                            List.of(
                                    "npm install",
                                    "npm run build"),
                            "/images/vercel-deploy.svg"
                    ),
                    new StepGuide(
                            optionalStack.getId(),
                            1,
                            "Create Node.js backend",
                            "Initialize a lightweight Express API to expose guide endpoints.",
                            List.of(
                                    "npm init -y",
                                    "npm install express cors"),
                            "/images/backend-setup.svg"
                    ),
                    new StepGuide(
                            optionalStack.getId(),
                            2,
                            "Deploy Node backend",
                            "Deploy the Node API on Render and expose a public base URL.",
                            List.of(
                                    "Build: npm install",
                                    "Start: node server.js"),
                            "/images/render-deploy.svg"
                    ),
                    new StepGuide(
                            optionalStack.getId(),
                            3,
                            "Connect frontend to Node API",
                            "Update VITE_API_BASE_URL and redeploy frontend on Vercel.",
                            List.of(
                                    "VITE_API_BASE_URL=https://<node-api-domain>",
                                    "npm run build"),
                            "/images/vercel-deploy.svg"
                    ));

            stepRepository.saveAll(steps);
        };
    }
}
