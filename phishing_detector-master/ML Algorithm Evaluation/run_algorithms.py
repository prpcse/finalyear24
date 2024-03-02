#!/usr/bin/python

import time
import numpy as np
import pandas as pd
from sklearn.cross_validation import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn import metrics
from sklearn.metrics import confusion_matrix

def calculate_metrics(y_test, Y_predicted):
    accuracy = metrics.accuracy_score(y_test, Y_predicted)
    print("accuracy = " + str(round(accuracy * 100, 2)) + "%")

    confusion_mat = confusion_matrix(y_test, Y_predicted)

    print(confusion_mat)
    print(confusion_mat.shape)

    print("TP\tFP\tFN\tTN\tSensitivity\tSpecificity")
    for i in range(confusion_mat.shape[0]):
        TP = round(float(confusion_mat[i, i]), 2)
        FP = round(float(confusion_mat[:, i].sum()), 2) - TP
        FN = round(float(confusion_mat[i, :].sum()), 2) - TP
        TN = round(float(confusion_mat.sum().sum()), 2) - TP - FP - FN
        print(str(TP) + "\t" + str(FP) + "\t" + str(FN) + "\t" + str(TN), end=' ')
        sensitivity = round(TP / (TP + FN), 2)
        specificity = round(TN / (TN + FP), 2)
        print("\t" + str(sensitivity) + "\t\t" + str(specificity) + "\t\t")

    f_score = metrics.f1_score(y_test, Y_predicted)
    print(f_score)

def neural_network(dataset, class_labels, test_size):
    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=42)

    model = MLPClassifier(hidden_layer_sizes=(100), activation='logistic', random_state=42)
    model.fit(X_train, y_train)
    Y_predicted = model.predict(X_test)

    return y_test, Y_predicted

def decision_tree(dataset, class_labels, test_size):
    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=42)

    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)
    Y_predicted = model.predict(X_test)

    return y_test, Y_predicted

def naive_bayes(dataset, class_labels, test_size):
    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=42)
    model = GaussianNB()
    model.fit(X_train, y_train)
    Y_predicted = model.predict(X_test)
    return y_test, Y_predicted

def ensemble_model(dataset, class_labels, test_size):
    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=test_size, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=5, criterion='entropy', random_state=42)
    nn_model = MLPClassifier(hidden_layer_sizes=(100), activation='logistic', random_state=42)
    svm_model = SVC(kernel='rbf', C=2.0)
    dt_model = DecisionTreeClassifier()
    nb_model = GaussianNB()

    ensemble_model = VotingClassifier(estimators=[
        ('rf', rf_model),
        ('nn', nn_model),
        ('svm', svm_model),
        ('dt', dt_model),
        ('nb', nb_model)
    ], voting='hard')

    ensemble_model.fit(X_train, y_train)
    Y_predicted = ensemble_model.predict(X_test)

    return y_test, Y_predicted

def main():
    dataset = "Dataset.csv"
    class_labels = "Target_Labels.csv"
    test_size = 0.3

    start_time = time.time()
    y_test, Y_predicted = neural_network(dataset, class_labels, test_size)
    calculate_metrics(y_test, Y_predicted)
    end_time = time.time()
    print("runtime = " + str(end_time - start_time) + " seconds")

    print("\nrunning ensemble model...")
    start_time = time.time()
    y_test, Y_predicted = ensemble_model(dataset, class_labels, test_size)
    calculate_metrics(y_test, Y_predicted)
    end_time = time.time()
    print("runtime = " + str(end_time - start_time) + " seconds")

if __name__ == '__main__':
    start_time = time.time()
    main()
    end_time = time.time()
    print("runtime = " + str(end_time - start_time) + " seconds")
