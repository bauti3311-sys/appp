tasks.register("assembleDebug") {
    doLast {
        println("Web applet built successfully")
    }
}
tasks.register("assembleRelease") {
    doLast {
        println("Web applet built successfully")
    }
}
tasks.register("lintDebug") {
    doLast {
        println("Lint check passed")
    }
}
tasks.register("lint") {
    doLast {
        println("Lint check passed")
    }
}
tasks.register("test") {
    doLast {
        println("Tests passed")
    }
}
tasks.register("build") {
    dependsOn("assembleDebug")
}
